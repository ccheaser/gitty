import React from 'react';
import axios from 'axios';

const StatusSelector = ({ recordId, currentStatus, onStatusChange }) => {
  const statuses = ['KATILACAĞIM', 'GELMEYECEĞİM', 'TELEFON İLE ARA', 'ULAŞMADI'];

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    const pat = process.env.REACT_APP_AIRTABLE_PAT;
    const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;

    try {
      const response = await axios({
        method: 'patch',
        url: `https://api.airtable.com/v0/${baseId}/Gitty ye Hoş Geldiniz/${recordId}`,
        headers: {
          'Authorization': `Bearer ${pat}`,
          'Content-Type': 'application/json'
        },
        data: {
          fields: {
            'MANUEL GİRİŞ': newStatus
          }
        }
      });
      
      if (response.status === 200) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Durum güncellenirken bir hata oluştu!');
    }
  };

  return (
    <select
      value={currentStatus || ''}
      onChange={handleChange}
      className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">Seçiniz</option>
      {statuses.map(status => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default StatusSelector;