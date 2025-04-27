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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pat = process.env.REACT_APP_AIRTABLE_PAT;
  const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;

  const COLORS = ['#10B981', '#EF4444']; // Yeşil (Katılacağım) ve Kırmızı (Gelmeyeceğim)

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

        // Son katılım durumuna göre sayıları hesapla
        const statusCounts = response.data.records.reduce((acc, record) => {
          const status = record.fields['SON KATILIM DURUMU'];
          if (status === 'KATILACAĞIM' || status === 'GELMEYECEĞİM') {
            acc[status] = (acc[status] || 0) + 1;
          }
          return acc;
        }, {});

        // Chart verisi formatında düzenle
        const formattedData = [
          { name: 'KATILACAĞIM', value: statusCounts['KATILACAĞIM'] || 0 },
          { name: 'GELMEYECEĞİM', value: statusCounts['GELMEYECEĞİM'] || 0 }
        ];

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Veriler çekilirken hata oluştu.');
        setLoading(false);
      }
    };

    fetchData();
  }, [pat, baseId]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Katılım Durumu Grafikleri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Pasta Grafik</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Bar Grafik</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Çizgi Grafik</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Alan Grafik</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="value" fill="#10B981" stroke="#064E3B" />
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