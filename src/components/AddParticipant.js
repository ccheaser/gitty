import { useState } from 'react';
import axios from 'axios';

function AddParticipant() {
  const [formData, setFormData] = useState({
    İSİM: '',
    TELEFON: '',
    mail: '',
    KATILIM: '',
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
      const response = await axios.post(
        `https://api.airtable.com/v0/${baseId}/Gitty ye Hoş Geldiniz`,
        {
          records: [
            {
              fields: {
                İSİM: formData.İSİM,
                TELEFON: Number(formData.TELEFON),
                mail: formData.mail,
                KATILIM: formData.KATILIM,
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${pat}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response.data);
      setSuccess('Katılımcı başarıyla eklendi!');
      setFormData({ İSİM: '', TELEFON: '', mail: '', KATILIM: '' });
    } catch (err) {
      console.error('Hata Detayı:', err.response);
      setError(err.response ? err.response.data.error.message : 'Katılımcı eklenirken hata oluştu.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-gray-900">Yeni Katılımcı Ekle</h3>
      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="İSİM">İsim</label>
          <input
            type="text"
            name="İSİM"
            value={formData.İSİM}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="TELEFON">Telefon</label>
          <input
            type="text"
            name="TELEFON"
            value={formData.TELEFON}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            pattern="[0-9]+"
            placeholder="905365551208"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="mail">E-posta</label>
          <input
            type="email"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="KATILIM">Katılım Durumu</label>
          <select
            name="KATILIM"
            value={formData.KATILIM}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Seçiniz</option>
            <option value="KATILACAĞIM">KATILACAĞIM</option>
            <option value="GELEMEYECEĞİM">GELEMEYECEĞİM</option>
            <option value="TELEFON İLE ARA">TELEFON İLE ARA</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          Katılımcı Ekle
        </button>
      </form>
    </div>
  );
}

export default AddParticipant;