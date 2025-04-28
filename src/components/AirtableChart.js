import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  AreaChart, Area
} from 'recharts';

function AirtableChart() {
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalParticipants: 0,
    willAttend: 0,
    willNotAttend: 0,
    percentageChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pat = process.env.REACT_APP_AIRTABLE_PAT;
  const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;

  const COLORS = ['#8B5CF6', '#F97316', '#6B7280', '#10B981'];

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

        const records = response.data.records;

        const statusCounts = records.reduce((acc, record) => {
          const status = record.fields['SON KATILIM DURUMU'];
          if (status === 'KATILACAĞIM' || status === 'GELMEYECEĞİM') {
            acc[status] = (acc[status] || 0) + 1;
          }
          return acc;
        }, {});

        const formattedData = [
          { name: 'KATILACAĞIM', value: statusCounts['KATILACAĞIM'] || 0 },
          { name: 'GELMEYECEĞİM', value: statusCounts['GELMEYECEĞİM'] || 0 }
        ];

        setChartData(formattedData);

        const total = records.length;
        const willAttend = statusCounts['KATILACAĞIM'] || 0;
        const willNotAttend = statusCounts['GELMEYECEĞİM'] || 0;
        const percentageChange = total > 0 ? ((willAttend / total) * 100).toFixed(1) : 0;

        setSummaryData({
          totalParticipants: total,
          willAttend,
          willNotAttend,
          percentageChange
        });

        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Veriler çekilirken hata oluştu.');
        setLoading(false);
      }
    };

    fetchData();
  }, [pat, baseId]);

  if (loading) return <div className="text-center text-muted-light dark:text-muted-dark text-lg">Yükleniyor...</div>;
  if (error) return <div className="text-center text-red-600 dark:text-red-400 text-lg">{error}</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Katılım İstatistikleri</h2>
          <p className="text-muted-light dark:text-muted-dark mt-1">Etkinlik katılım durumlarına ait özet ve detaylı grafikler</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Toplam Katılımcı</p>
                <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{summaryData.totalParticipants}</h3>
                <p className="text-xs text-green-600 dark:text-green-400">+{summaryData.percentageChange}% katılım oranı</p>
              </div>
              <div className="text-purple-500 dark:text-purple-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Katılacağım</p>
                <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{summaryData.willAttend}</h3>
                <p className="text-xs text-green-600 dark:text-green-400">+{summaryData.willAttend > 0 ? ((summaryData.willAttend / summaryData.totalParticipants) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="text-orange-500 dark:text-orange-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Gelmeyeceğim</p>
                <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{summaryData.willNotAttend}</h3>
                <p className="text-xs text-red-600 dark:text-red-400">-{summaryData.willNotAttend > 0 ? ((summaryData.willNotAttend / summaryData.totalParticipants) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-light dark:text-muted-dark">Toplam Oran</p>
                <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{summaryData.percentageChange}%</h3>
                <p className="text-xs text-green-600 dark:text-green-400">Katılım Oranı</p>
              </div>
              <div className="text-green-500 dark:text-green-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Katılım Durumu (Pasta Grafik)</h3>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Katılım Durumu (Çizgi Grafik)</h3>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Katılım Durumu (Bar Grafik)</h3>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Katılım Durumu (Alan Grafik)</h3>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="value" fill="#8B5CF6" fillOpacity={0.3} stroke="#8B5CF6" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirtableChart;