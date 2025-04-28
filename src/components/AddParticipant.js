import { useState } from 'react';
import axios from 'axios';
import { logAction } from '../utils/logAction';

function AddParticipant() {
  const [formData, setFormData] = useState({
    'AD SOYAD': '',
    'TELEFON': '',
    'E POSTA': '',
    'SON KATILIM DURUMU': ''
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const pat = process.env.REACT_APP_AIRTABLE_PAT;
  const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'TELEFON') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!pat || !baseId) {
      setError('.env dosyasından PAT veya Base ID okunamadı.');
      return;
    }

    try {
      // Sadece değeri olan alanları içeren bir nesne oluştur
      const fields = {};
      if (formData['AD SOYAD']) fields['AD SOYAD'] = formData['AD SOYAD'];
      if (formData['TELEFON']) fields['TELEFON'] = Number(formData['TELEFON']);
      if (formData['E POSTA']) fields['E POSTA'] = formData['E POSTA'];
      if (formData['SON KATILIM DURUMU']) fields['SON KATILIM DURUMU'] = formData['SON KATILIM DURUMU'];

      const response = await axios.post(
        `https://api.airtable.com/v0/${baseId}/Gitty ye Hoş Geldiniz`,
        {
          records: [{ fields }],
        },
        {
          headers: {
            Authorization: `Bearer ${pat}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess('Katılımcı başarıyla eklendi!');
      await logAction('add_participant', { name: formData['AD SOYAD'], email: formData['E POSTA'] });
      setFormData({ 'AD SOYAD': '', 'TELEFON': '', 'E POSTA': '', 'SON KATILIM DURUMU': '' });
    } catch (err) {
      console.error('Hata detayı:', err);
      setError(err.response ? err.response.data.error.message : 'Katılımcı eklenirken hata oluştu.');
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark max-w-lg mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">Yeni Katılımcı Ekle</h3>
      {success && <p className="text-green-600 dark:text-green-400 mb-4">{success}</p>}
      {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-muted-light dark:text-muted-dark mb-2" htmlFor="AD SOYAD">İsim*</label>
          <input
            type="text"
            name="AD SOYAD"
            value={formData['AD SOYAD']}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark transition-colors duration-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-muted-light dark:text-muted-dark mb-2" htmlFor="TELEFON">Telefon</label>
          <input
            type="text"
            name="TELEFON"
            value={formData['TELEFON']}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark transition-colors duration-300"
            pattern="[0-9]*"
            placeholder="905365551208"
          />
        </div>
        <div className="mb-4">
          <label className="block text-muted-light dark:text-muted-dark mb-2" htmlFor="E POSTA">E-posta</label>
          <input
            type="email"
            name="E POSTA"
            value={formData['E POSTA']}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark transition-colors duration-300"
          />
        </div>
        <div className="mb-6">
          <label className="block text-muted-light dark:text-muted-dark mb-2" htmlFor="SON KATILIM DURUMU">Katılım Durumu</label>
          <select
            name="SON KATILIM DURUMU"
            value={formData['SON KATILIM DURUMU']}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark transition-colors duration-300"
          >
            <option value="">Seçiniz</option>
            <option value="KATILACAĞIM">KATILACAĞIM</option>
            <option value="GELMEYECEĞİM">GELMEYECEĞİM</option>
            <option value="TELEFON İLE ARA">TELEFON İLE ARA</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary-light dark:bg-primary-dark text-white py-3 rounded-lg hover:bg-green-600 dark:hover:bg-purple-700 transition-colors duration-300 font-medium"
        >
          Katılımcı Ekle
        </button>
      </form>
    </div>
  );
}

export default AddParticipant;