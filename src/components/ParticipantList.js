import { useState, useEffect } from 'react';
import axios from 'axios';

function ParticipantList() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const pat = process.env.REACT_APP_AIRTABLE_PAT;
  const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.airtable.com/v0/${baseId}/Gitty ye Hoş Geldiniz`,
          {
            headers: {
              Authorization: `Bearer ${pat}`,
            },
          }
        );

        setParticipants(response.data.records);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [pat, baseId]);

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Katılımcı Listesi</h2>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <ul className="space-y-4">
            {participants.map((participant) => (
              <li key={participant.id} className="border-b pb-2">
                <p className="font-semibold">{participant.fields['AD SOYAD']}</p>
                <p className="text-sm text-gray-600">{participant.fields['E POSTA']}</p>
                <p className="text-sm text-gray-600">
                  Katılım: {participant.fields['SON KATILIM DURUMU']}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ParticipantList;