import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(logData);
        setLoading(false);
      },
      (err) => {
        setError('Loglar çekilirken hata oluştu: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-muted-light dark:text-muted-dark text-lg">
        Yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-card-light dark:bg-card-dark shadow-soft dark:shadow-soft-dark rounded-xl p-8">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-8">
          İşlem Logları
        </h2>
        {logs.length === 0 ? (
          <p className="text-muted-light dark:text-muted-dark text-center">
            Henüz log kaydı bulunmuyor.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">
                    İşlem Türü
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">
                    Detaylar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card-light dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-600">
                {logs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={index % 2 === 0 ? 'bg-card-light dark:bg-card-dark' : 'bg-gray-50 dark:bg-gray-800'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                      {log.actionType || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                      {log.userEmail || 'Bilinmiyor'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                      {JSON.stringify(log.details) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                      {log.timestamp?.toDate().toLocaleString('tr-TR') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogsPage;