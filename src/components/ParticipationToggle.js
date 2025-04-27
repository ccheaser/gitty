import React, { useState } from 'react';
import { updateParticipationStatus } from '../utils/airtableApi';

const ParticipationToggle = ({ recordId, initialStatus, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newStatus = !status;
      await updateParticipationStatus(recordId, newStatus);
      setStatus(newStatus);
      onStatusChange && onStatusChange(newStatus);
    } catch (error) {
      alert('Güncelleme sırasında bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-md ${
        status 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-red-500 hover:bg-red-600'
      } text-white transition-colors`}
    >
      {loading ? 'Güncelleniyor...' : status ? 'Katılıyor' : 'Katılmıyor'}
    </button>
  );
};

export default ParticipationToggle;