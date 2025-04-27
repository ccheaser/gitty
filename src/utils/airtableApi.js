import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.REACT_APP_AIRTABLE_PAT
}).base(process.env.REACT_APP_AIRTABLE_BASE_ID);

export const updateParticipationStatus = async (recordId, field, newStatus) => {
  try {
    const fields = {};
    
    // Hangi katılım alanının güncelleneceğini belirle
    switch(field) {
      case 'son':
        fields['SON KATILIM DURUMU'] = newStatus;
        break;
      case 'wp':
        fields['WP KATILIM DURUMU'] = newStatus;
        break;
      case 'eposta':
        fields['E POSTA KATILIM DURUMU'] = newStatus;
        break;
      case 'sms':
        fields['SMS KATILIM DURUMU'] = newStatus;
        break;
      default:
        throw new Error('Geçersiz alan adı');
    }

    const response = await base('Katılımcılar').update(recordId, fields);
    return response;
  } catch (error) {
    console.error('Error updating participation status:', error);
    throw error;
  }
};

// Tüm katılımcıları getirmek için
export const getParticipants = async () => {
  try {
    const records = await base('Katılımcılar').select({
      view: 'Grid view'
    }).all();
    return records;
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
};

