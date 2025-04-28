const express = require('express');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { Buffer } = require('buffer');

const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.SENDGRID_API_KEY) {
  process.exit(1);
}

const NETGSM_USERNAME = process.env.NETGSM_USERNAME;
const NETGSM_PASSWORD = process.env.NETGSM_PASSWORD;
const NETGSM_MSGHEADER = process.env.NETGSM_MSGHEADER;

if (!NETGSM_USERNAME || !NETGSM_PASSWORD || !NETGSM_MSGHEADER) {
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// CORS options
const corsOptions = {
  origin: [
    'http://31.57.33.227',
    'http://localhost:3000',
    'http://your-domain.com'
  ],
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const isValidPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/\D/g, '');
  return /^90\d{10}$|^00\d{11,}$/.test(cleaned);
};

const FROM_EMAIL = process.env.FROM_EMAIL || 'your_verified_email@domain.com';

app.post('/api/send-email', async (req, res) => {
  const { email, name, message } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Geçersiz e-posta adresi.' });
  }

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Mesaj metni geçersiz.' });
  }

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: 'Gitty Etkinlik Daveti',
    text: message,
    html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true, message: 'E-posta başarıyla gönderildi!' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `E-posta gönderilirken hata oluştu: ${error.message}`,
      details: error.response ? error.response.body : null
    });
  }
});

app.post('/api/send-bulk-emails', async (req, res) => {
  const recipients = req.body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ success: false, message: 'Geçerli alıcı listesi gerekli.' });
  }

  const results = [];
  const failedEmails = [];

  for (const { email, name, message } of recipients) {
    if (isValidEmail(email) && message && typeof message === 'string') {
      const msg = {
        to: email,
        from: FROM_EMAIL,
        subject: 'Gitty Etkinlik Daveti',
        text: message,
        html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
      };

      try {
        await sgMail.send(msg);
        results.push({ email, success: true, message: 'E-posta başarıyla gönderildi!' });
      } catch (error) {
        results.push({
          email,
          success: false,
          message: `E-posta gönderilirken hata oluştu: ${error.message}`,
          details: error.response ? error.response.body : null
        });
        failedEmails.push(email);
      }
    } else {
      results.push({ email, success: false, message: 'Geçersiz e-posta adresi veya mesaj' });
      failedEmails.push(email);
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;

  res.json({
    success: true,
    message: `Toplu e-posta gönderimi tamamlandı! Başarılı: ${successCount}, Başarısız: ${failureCount}`,
    results,
    failedEmails
  });
});

app.post('/api/send-sms', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !isValidPhoneNumber(phone)) {
    return res.status(400).json({ success: false, message: 'Geçersiz telefon numarası.' });
  }

  if (!message || typeof message !== 'string' || message.length > 917) {
    return res.status(400).json({ success: false, message: 'Mesaj metni geçersiz veya 917 karakterden uzun.' });
  }

  try {
    const authString = `${NETGSM_USERNAME}:${NETGSM_PASSWORD}`;
    const authHeader = 'Basic ' + Buffer.from(authString).toString('base64');

    const params = {
      usercode: NETGSM_USERNAME,
      password: NETGSM_PASSWORD,
      gsmno: phone,
      message: message,
      msgheader: NETGSM_MSGHEADER,
      encoding: 'TR',
      iysfilter: '0',
    };

    const response = await axios.get('https://api.netgsm.com.tr/sms/send/get/', {
      params,
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.startsWith('00')) {
      const jobid = response.data.split(' ')[1];
      res.json({ success: true, message: 'SMS başarıyla gönderildi!', jobid });
    } else {
      const errorCode = response.data.split(' ')[0];
      let errorMessage = 'Bilinmeyen hata';
      switch (errorCode) {
        case '20':
          errorMessage = 'Mesaj metninde sorun var veya karakter sınırı aşıldı.';
          break;
        case '30':
          errorMessage = 'Geçersiz kullanıcı adı/şifre veya API erişim izni yok.';
          break;
        case '40':
          errorMessage = 'Mesaj başlığı sistemde tanımlı değil.';
          break;
        case '70':
          errorMessage = 'Hatalı parametre veya eksik zorunlu alan.';
          break;
        default:
          errorMessage = response.data;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `SMS gönderilirken hata oluştu: ${error.message}`,
    });
  }
});

app.post('/api/send-bulk-sms', async (req, res) => {
  const recipients = req.body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ success: false, message: 'Geçerli alıcı listesi gerekli.' });
  }

  const results = [];
  const failedNumbers = [];

  const authString = `${NETGSM_USERNAME}:${NETGSM_PASSWORD}`;
  const authHeader = 'Basic ' + Buffer.from(authString).toString('base64');

  for (const { phone, message } of recipients) {
    if (isValidPhoneNumber(phone) && message && typeof message === 'string' && message.length <= 917) {
      try {
        const params = {
          usercode: NETGSM_USERNAME,
          password: NETGSM_PASSWORD,
          gsmno: phone,
          message: message,
          msgheader: NETGSM_MSGHEADER,
          encoding: 'TR',
          iysfilter: '0',
        };

        const response = await axios.get('https://api.netgsm.com.tr/sms/send/get/', {
          params,
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        });

        if (response.data && response.data.startsWith('00')) {
          const jobid = response.data.split(' ')[1];
          results.push({ phone, success: true, message: 'SMS başarıyla gönderildi!', jobid });
        } else {
          const errorCode = response.data.split(' ')[0];
          let errorMessage = 'Bilinmeyen hata';
          switch (errorCode) {
            case '20':
              errorMessage = 'Mesaj metninde sorun var veya karakter sınırı aşıldı.';
              break;
            case '30':
              errorMessage = 'Geçersiz kullanıcı adı/şifre veya API erişim izni yok.';
              break;
            case '40':
              errorMessage = 'Mesaj başlığı sistemde tanımlı değil.';
              break;
            case '70':
              errorMessage = 'Hatalı parametre veya eksik zorunlu alan.';
              break;
            default:
              errorMessage = response.data;
          }
          results.push({ phone, success: false, message: errorMessage });
          failedNumbers.push(phone);
        }
      } catch (error) {
        results.push({ phone, success: false, message: `SMS gönderilirken hata oluştu: ${error.message}` });
        failedNumbers.push(phone);
      }
    } else {
      results.push({ phone, success: false, message: 'Geçersiz telefon numarası veya mesaj' });
      failedNumbers.push(phone);
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;

  res.json({
    success: true,
    message: `Toplu SMS gönderimi tamamlandı! Başarılı: ${successCount}, Başarısız: ${failureCount}`,
    results,
    failedNumbers
  });
});

app.get('/api/sms-status/:jobid', async (req, res) => {
  const { jobid } = req.params;

  if (!jobid || typeof jobid !== 'string') {
    return res.status(400).json({ success: false, message: 'Geçersiz jobid.' });
  }

  try {
    const authString = `${NETGSM_USERNAME}:${NETGSM_PASSWORD}`;
    const authHeader = 'Basic ' + Buffer.from(authString).toString('base64');

    const params = {
      usercode: NETGSM_USERNAME,
      password: NETGSM_PASSWORD,
      jobid: jobid,
    };

    const response = await axios.get('https://api.netgsm.com.tr/sms/report/', {
      params,
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    res.json({ success: true, status: response.data });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(200).json({
        success: true,
        status: 'Durum henüz mevcut değil (404). Gönderim kuyrukta olabilir.',
      });
    }
    res.status(500).json({
      success: false,
      message: `SMS durumu sorgulanırken hata oluştu: ${error.message}`,
    });
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.', error: err.message });
});

app.listen(port, () => {});