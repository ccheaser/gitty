import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logAction } from '../utils/logAction';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { API_URL } from '../config/config';

function AirtableList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkEmailSending, setBulkEmailSending] = useState(false);
  const [bulkSMSSending, setBulkSMSSending] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalTarget, setModalTarget] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    contactType: '',
    sortBy: 'newest'
  });

  const pat = process.env.REACT_APP_AIRTABLE_PAT;
  const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;

  useEffect(() => {
    const fetchData = async () => {
      if (!pat || !baseId) {
        setError('.env dosyasından PAT veya Base ID okunamadı.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.airtable.com/v0/${baseId}/Gitty ye Hoş Geldiniz`,
          {
            headers: {
              Authorization: `Bearer ${pat}`,
            },
          }
        );

        const sortedRecords = response.data.records
          .map(record => {
            if (!record.fields) {
              toast.error(`Kayıt eksik veri içeriyor: ${record.id}`, {
                position: "top-right",
                autoClose: 5000,
              });
              return null;
            }

            return {
              ...record,
              fields: {
                ...record.fields,
                TELEFON: record.fields['TELEFON'] ? String(record.fields['TELEFON']) : '',
                'E POSTA': record.fields['E POSTA'] ? String(record.fields['E POSTA']) : '',
                'AD SOYAD': record.fields['AD SOYAD'] ? String(record.fields['AD SOYAD']) : '',
                'SON KATILIM DURUMU': record.fields['SON KATILIM DURUMU'] ? String(record.fields['SON KATILIM DURUMU']) : '',
              },
            };
          })
          .filter(record => record !== null)
          .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

        setRecords(sortedRecords);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Veriler çekilirken hata oluştu.');
        setLoading(false);
      }
    };

    fetchData();
  }, [pat, baseId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterRecords = (records) => {
    return records.filter(record => {
      const searchMatch = filters.search.toLowerCase() === '' ||
        record.fields['AD SOYAD']?.toLowerCase().includes(filters.search.toLowerCase()) ||
        record.fields['E POSTA']?.toLowerCase().includes(filters.search.toLowerCase()) ||
        record.fields['TELEFON']?.includes(filters.search);

      const statusMatch = filters.status === '' ||
        record.fields['SON KATILIM DURUMU'] === filters.status;

      const contactTypeMatch = filters.contactType === '' || (
        filters.contactType === 'phone' ? isValidPhoneNumber(record.fields['TELEFON']) :
        filters.contactType === 'email' ? isValidEmail(record.fields['E POSTA']) :
        true
      );

      return searchMatch && statusMatch && contactTypeMatch;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdTime) - new Date(a.createdTime);
      } else if (filters.sortBy === 'oldest') {
        return new Date(a.createdTime) - new Date(b.createdTime);
      } else if (filters.sortBy === 'name') {
        return (a.fields['AD SOYAD'] || '').localeCompare(b.fields['AD SOYAD'] || '');
      }
      return 0;
    });
  };

  const exportToCSV = async (records) => {
    const csvContent = [
      ['AD SOYAD', 'TELEFON', 'E POSTA', 'SON KATILIM DURUMU', 'WP KATILIM DURUMU', 'E POSTA KATILIM DURUMU', 'SMS KATILIM DURUMU'],
      ...records.map(record => [
        record.fields['AD SOYAD'] || '',
        record.fields['TELEFON'] || '',
        record.fields['E POSTA'] || '',
        record.fields['SON KATILIM DURUMU'] || '',
        record.fields['WP KATILIM DURUMU'] || '',
        record.fields['E POSTA KATILIM DURUMU'] || '',
        record.fields['SMS KATILIM DURUMU'] || ''
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "katilimci_listesi.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await logAction('export_csv', { recordCount: records.length });
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;

    let phoneStr = String(phone).trim();
    let cleaned = phoneStr.replace(/\D/g, '');

    if (cleaned.startsWith('90')) {
      cleaned = cleaned.slice(2);
    } else if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    } else if (cleaned.startsWith('00')) {
      return cleaned;
    }

    if (cleaned.length !== 10) return null;

    return `90${cleaned}`;
  };

  const isValidPhoneNumber = (phone) => {
    const formatted = formatPhoneNumber(phone);
    if (!formatted) return false;
    return /^90\d{10}$|^00\d{11,}$/.test(formatted);
  };

  const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const openModal = (type, target = null) => {
    setModalType(type);
    setModalTarget(target);
    setMessageContent('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setModalTarget(null);
    setMessageContent('');
  };

  const handleModalSend = async () => {
    if (!messageContent.trim()) {
      toast.error('Lütfen mesaj içeriğini girin!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (modalType === 'sms') {
      await sendSMS(modalTarget, messageContent);
    } else if (modalType === 'email') {
      await sendEmail(modalTarget.email, modalTarget.name, messageContent);
    } else if (modalType === 'bulk-sms') {
      await sendBulkSMS(messageContent);
    } else if (modalType === 'bulk-email') {
      await sendBulkEmails(messageContent);
    }

    closeModal();
  };

  const sendTemplateMessage = async (phoneNumber) => {
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      if (!formattedPhone) {
        throw new Error('Telefon numarası geçersiz veya boş: Lütfen +90 veya 0 ile başlayan 10 haneli bir numara girin.');
      }

      const requestBody = {
        broadcast_name: "yeni_davetli_eklendi_250420250554",
        template_name: "yeni_davetli_eklendi",
        elementName: "yeni_davetli_eklendi",
        languageCode: "tr",
        parameters: [
          {
            name: "etkinlik_adi",
            value: "Gitty Etkinliği"
          }
        ]
      };

      const response = await axios.post(
        `https://live-mt-server.wati.io/422306/api/v1/sendTemplateMessage?whatsappNumber=${encodeURIComponent(formattedPhone)}`,
        requestBody,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZGY5NTZmYy1jOWQzLTQzNDktYjUzMy03ZTkxZTgxNmU4YWIiLCJ1bmlxdWVfbmFtZSI6InZvbGthbkBnaXR0eS5jb20udHIiLCJuYW1laWQiOiJ2b2xrYW5AZ2l0dHkuY29tLnRyIiwiZW1haWwiOiJ2b2xrYW5AZ2l0dHkuY29tLnRyIiwiYXV0aF90aW1lIjoiMDQvMjUvMjAyNSAwMTo0NjoyOCIsInRlbmFudF9pZCI6IjQyMjMwNiIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.wBQABqymj9Sh86u82wrbf9rUESit2_zxRglwUrUrv40',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.result) {
        toast.success('WhatsApp mesajı başarıyla gönderildi!', {
          position: "top-right",
          autoClose: 3000,
        });
        await logAction('send_whatsapp_message', { phone: formattedPhone });
        return { success: true, message: 'Mesaj başarıyla gönderildi!' };
      } else {
        throw new Error(response.data.info || 'Mesaj gönderilemedi');
      }
    } catch (error) {
      toast.error(`WhatsApp mesajı gönderilirken hata oluştu: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return { success: false, message: `Mesaj gönderilirken hata oluştu: ${error.message}` };
    }
  };

  const sendEmail = async (email, name, customMessage) => {
    try {
      if (!isValidEmail(email)) {
        throw new Error('Geçersiz e-posta adresi.');
      }

      const response = await axios.post(`${API_URL}/api/send-email`, {
        email,
        name,
        message: customMessage
      });

      if (response.data.success) {
        toast.success('E-posta başarıyla gönderildi!', {
          position: "top-right",
          autoClose: 3000,
        });
        await logAction('send_email', { email, name });
      } else {
        toast.error(`E-posta gönderilirken hata oluştu: ${response.data.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      const details = error.response?.data?.details ? `\nDetaylar: ${JSON.stringify(error.response.data.details)}` : '';
      toast.error(`E-posta gönderilirken hata oluştu: ${message}${details}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return { success: false, message: `E-posta gönderilirken hata oluştu: ${message}` };
    }
  };

  const sendSMS = async (phone, customMessage) => {
    try {
      const formattedPhone = formatPhoneNumber(phone);
      if (!formattedPhone) {
        throw new Error('Geçersiz telefon numarası.');
      }

      const response = await axios.post(`${API_URL}/api/send-sms`, {
        phone: formattedPhone,
        message: customMessage
      });

      let statusMessage = 'Durum sorgulanamadı.';
      if (response.data.success) {
        const jobid = response.data.jobid;
        try {
          const statusResponse = await axios.get(`${API_URL}/api/sms-status/${jobid}`);
          statusMessage = statusResponse.data.status;
        } catch (statusError) {
          statusMessage = 'Durum sorgulanamadı: ' + (statusError.response?.data?.message || statusError.message);
        }

        toast.success(`SMS başarıyla gönderildi!\nGönderim ID: ${jobid}\nDurum: ${statusMessage}`, {
          position: "top-right",
          autoClose: 5000,
        });
        await logAction('send_sms', { phone: formattedPhone });
        return response.data;
      } else {
        toast.error(`SMS gönderilirken hata oluştu: ${response.data.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
        return { success: false, message: `SMS gönderilirken hata oluştu: ${response.data.message}` };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(`SMS gönderilirken hata oluştu: ${message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return { success: false, message: `SMS gönderilirken hata oluştu: ${message}` };
    }
  };

  const sendBulkMessages = async () => {
    if (selectedRecords.length === 0) {
      toast.error('Lütfen en az bir kişi seçin!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setBulkSending(true);
    const results = [];
    const failedNumbers = [];

    for (const recordId of selectedRecords) {
      const record = records.find(r => r.id === recordId);
      if (record && isValidPhoneNumber(record.fields['TELEFON'])) {
        const result = await sendTemplateMessage(record.fields['TELEFON']);
        results.push({
          phone: record.fields['TELEFON'],
          ...result
        });
        if (!result.success) {
          failedNumbers.push(record.fields['TELEFON']);
        }
      } else {
        results.push({
          phone: record.fields['TELEFON'] || 'Bilinmiyor',
          success: false,
          message: 'Geçersiz telefon numarası'
        });
        failedNumbers.push(record.fields['TELEFON'] || 'Bilinmiyor');
      }
    }

    setBulkSending(false);
    setSelectedRecords([]);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    let toastMessage = `Toplu mesaj gönderimi tamamlandı!\nBaşarılı: ${successCount} kişi\nBaşarısız: ${failureCount} kişi`;
    if (failureCount > 0) {
      toastMessage += `\nBaşarısız numaralar:\n${failedNumbers.join('\n')}`;
    }

    toast.success(toastMessage, {
      position: "top-right",
      autoClose: 5000,
    });

    await logAction('send_bulk_whatsapp', { successCount, failureCount, failedNumbers });
  };

  const sendBulkEmails = async (customMessage) => {
    if (selectedRecords.length === 0) {
      toast.error('Lütfen en az bir kişi seçin!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setBulkEmailSending(true);
    const recipients = selectedRecords
      .map(recordId => {
        const record = records.find(r => r.id === recordId);
        return record && record.fields && isValidEmail(record.fields['E POSTA'])
          ? { email: record.fields['E POSTA'], name: record.fields['AD SOYAD'] }
          : null;
      })
      .filter(Boolean);

    if (recipients.length === 0) {
      setBulkEmailSending(false);
      toast.error('Geçerli e-posta adresi olan kişi seçilmedi.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/send-bulk-emails`, recipients.map(recipient => ({
        ...recipient,
        message: customMessage
      })));

      setBulkEmailSending(false);
      setSelectedRecords([]);

      const { results, failedEmails } = response.data;
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      let toastMessage = `Toplu e-posta gönderimi tamamlandı!\nBaşarılı: ${successCount} kişi\nBaşarısız: ${failureCount} kişi`;
      if (failureCount > 0) {
        toastMessage += `\nBaşarısız e-postalar:\n${failedEmails.join('\n')}`;
      }

      toast.success(toastMessage, {
        position: "top-right",
        autoClose: 5000,
      });

      await logAction('send_bulk_email', { successCount, failureCount, failedEmails });
    } catch (error) {
      setBulkEmailSending(false);
      setSelectedRecords([]);
      const message = error.response?.data?.message || error.message;
      const details = error.response?.data?.details ? `\nDetaylar: ${JSON.stringify(error.response.data.details)}` : '';
      toast.error(`Toplu e-posta gönderilirken hata oluştu: ${message}${details}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const sendBulkSMS = async (customMessage) => {
    if (selectedRecords.length === 0) {
      toast.error('Lütfen en az bir kişi seçin!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setBulkSMSSending(true);
    const recipients = selectedRecords
      .map(recordId => {
        const record = records.find(r => r.id === recordId);
        const formattedPhone = formatPhoneNumber(record.fields['TELEFON']);
        return record && isValidPhoneNumber(record.fields['TELEFON'])
          ? { phone: formattedPhone, message: customMessage }
          : null;
      })
      .filter(Boolean);

    if (recipients.length === 0) {
      setBulkSMSSending(false);
      toast.error('Geçerli telefon numarası olan kişi seçilmedi.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/send-bulk-sms`, recipients);

      setBulkSMSSending(false);
      setSelectedRecords([]);

      const { results, failedNumbers } = response.data;
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      let toastMessage = `Toplu SMS gönderimi tamamlandı!\nBaşarılı: ${successCount} kişi\nBaşarısız: ${failureCount} kişi`;
      if (failureCount > 0) {
        toastMessage += `\nBaşarısız numaralar:\n${failedNumbers.join('\n')}`;
      }

      toast.success(toastMessage, {
        position: "top-right",
        autoClose: 5000,
      });

      await logAction('send_bulk_sms', { successCount, failureCount, failedNumbers });
    } catch (error) {
      setBulkSMSSending(false);
      setSelectedRecords([]);
      const message = error.response?.data?.message || error.message;
      toast.error(`Toplu SMS gönderilirken hata oluştu: ${message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const toggleRecordSelection = (recordId) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const toggleSelectAll = () => {
    // Önce mevcut filtrelenmiş kayıtları al
    const filteredRecords = filterRecords(records);
    
    // Eğer filtrelenmiş kayıtların hepsi seçili ise seçimleri kaldır
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([]);
    } else {
      // Değilse, sadece filtrelenmiş kayıtları seç
      const filteredRecordIds = filteredRecords.map(record => record.id);
      setSelectedRecords(filteredRecordIds);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Katıldı':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'Katılmadı':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) return <div className="text-center text-muted-light dark:text-muted-dark text-lg">Yükleniyor...</div>;
  if (error) return <div className="text-center text-red-600 dark:text-red-400 text-lg">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-card-light dark:bg-card-dark shadow-soft dark:shadow-soft-dark rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Katılımcı Listesi</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => exportToCSV(records)}
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 transition-all duration-200 text-sm font-semibold"
            >
              CSV İndir
            </button>
            <button
              onClick={sendBulkMessages}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800 transition-all duration-200 text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={selectedRecords.length === 0 || bulkSending}
            >
              {bulkSending ? 'Gönderiliyor...' : `Seçilenlere Mesaj Gönder (${selectedRecords.length})`}
            </button>
            <button
              onClick={() => openModal('bulk-email')}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white rounded-lg shadow-md hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 transition-all duration-200 text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={selectedRecords.length === 0 || bulkEmailSending}
            >
              {bulkEmailSending ? 'Gönderiliyor...' : `Seçilenlere E-posta Gönder (${selectedRecords.length})`}
            </button>
            <button
              onClick={() => openModal('bulk-sms')}
              className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 dark:hover:from-teal-700 dark:hover:to-teal-800 transition-all duration-200 text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={selectedRecords.length === 0 || bulkSMSSending}
            >
              {bulkSMSSending ? 'Gönderiliyor...' : `Seçilenlere SMS Gönder (${selectedRecords.length})`}
            </button>
          </div>
        </div>

        {/* Filtreleme Arayüzü */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-light dark:text-muted-dark" />
          </div>
          
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark"
          >
            <option value="">Tüm Durumlar</option>
            <option value="KATILACAĞIM">Katılacağım</option>
            <option value="GELMEYECEĞİM">Gelemeyeceğim</option>
            <option value="TELEFON İLE ARA">Telefon İle Ara</option>
          </select>

          <select
            name="contactType"
            value={filters.contactType}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark"
          >
            <option value="">Tüm İletişim Türleri</option>
            <option value="phone">Geçerli Telefon</option>
            <option value="email">Geçerli E-posta</option>
          </select>

          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark"
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="name">İsme Göre</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedRecords.length === filterRecords(records).length && filterRecords(records).length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark border-gray-300 dark:border-gray-600 rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">Ad Soyad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">E-Posta</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">Son Katılım</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-card-light dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-600">
              {filterRecords(records).map((record, index) => (
                <tr key={record.id} className={index % 2 === 0 ? 'bg-card-light dark:bg-card-dark' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                    <input
                      type="checkbox"
                      checked={selectedRecords.includes(record.id)}
                      onChange={() => toggleRecordSelection(record.id)}
                      className="h-4 w-4 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark border-gray-300 dark:border-gray-600 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{record.fields['AD SOYAD'] || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                    {record.fields['TELEFON'] || '-'}
                    {!isValidPhoneNumber(record.fields['TELEFON']) && (
                      <span className="text-red-600 dark:text-red-400 text-xs ml-2">(Geçersiz)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                    {record.fields['E POSTA'] || '-'}
                    {record.fields['E POSTA'] && !isValidEmail(record.fields['E POSTA']) && (
                      <span className="text-red-600 dark:text-red-400 text-xs ml-2">(Geçersiz)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(record.fields['SON KATILIM DURUMU'])}`}>
                      {record.fields['SON KATILIM DURUMU'] || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-3">
                    <button
                      onClick={() => sendTemplateMessage(record.fields['TELEFON'])}
                      className="px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!isValidPhoneNumber(record.fields['TELEFON'])}
                    >
                      Mesaj Gönder
                    </button>
                    <button
                      onClick={() => openModal('email', { email: record.fields['E POSTA'], name: record.fields['AD SOYAD'] })}
                      className="px-4 py-1 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white rounded-lg shadow-sm hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 transition-all duration-200 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!isValidEmail(record.fields['E POSTA'])}
                    >
                      E-posta Gönder
                    </button>
                    <button
                      onClick={() => openModal('sms', record.fields['TELEFON'])}
                      className="px-4 py-1 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 text-white rounded-lg shadow-sm hover:from-teal-600 hover:to-teal-700 dark:hover:from-teal-700 dark:hover:to-teal-800 transition-all duration-200 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!isValidPhoneNumber(record.fields['TELEFON'])}
                    >
                      SMS Gönder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-card-light dark:bg-card-dark rounded-xl p-8 w-full max-w-lg shadow-soft dark:shadow-soft-dark">
            <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-6">
              {modalType === 'sms' ? 'SMS Gönder' : 
               modalType === 'email' ? 'E-posta Gönder' : 
               modalType === 'bulk-sms' ? 'Toplu SMS Gönder' : 
               'Toplu E-posta Gönder'}
            </h3>
            <textarea
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all duration-200 resize-none bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark"
              rows="5"
              placeholder="Mesaj içeriğini buraya girin..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
              >
                İptal
              </button>
              <button
                onClick={handleModalSend}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 font-medium"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AirtableList;