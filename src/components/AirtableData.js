import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import StatusSelector from './StatusSelector';
import { logAction } from '../utils/logAction';

const exportToCSV = async (records) => {
  const headers = ['Ad Soyad', 'Telefon', 'E-Posta', 'Son Katılım', 'WP Katılım', 'E-Posta Katılım', 'SMS Katılım', 'Manuel Giriş'];
  const data = records.map(record => [
    record.fields['AD SOYAD'] || '',
    record.fields['TELEFON'] || '',
    record.fields['E POSTA'] || '',
    record.fields['SON KATILIM DURUMU'] || '',
    record.fields['WP KATILIM DURUMU'] || '',
    record.fields['E POSTA KATILIM DURUMU'] || '',
    record.fields['SMS KATILIM DURUMU'] || '',
    record.fields['MANUEL GİRİŞ'] || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'katilimci-listesi.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  await logAction('export_csv', { recordCount: records.length });
};

const exportToExcel = async (records) => {
  const headers = ['Ad Soyad', 'Telefon', 'E-Posta', 'Son Katılım', 'WP Katılım', 'E-Posta Katılım', 'SMS Katılım', 'Manuel Giriş'];
  const data = [
    headers,
    ...records.map(record => [
      record.fields['AD SOYAD'] || '',
      record.fields['TELEFON'] || '',
      record.fields['E POSTA'] || '',
      record.fields['SON KATILIM DURUMU'] || '',
      record.fields['WP KATILIM DURUMU'] || '',
      record.fields['E POSTA KATILIM DURUMU'] || '',
      record.fields['SMS KATILIM DURUMU'] || '',
      record.fields['MANUEL GİRİŞ'] || ''
    ])
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Katılımcılar");
  XLSX.writeFile(wb, "katilimci-listesi.xlsx");

  await logAction('export_excel', { recordCount: records.length });
};

const exportToPDF = async (records) => {
  const doc = new jsPDF();
  const headers = [['Ad Soyad', 'Telefon', 'E-Posta', 'Son Katılım', 'WP Katılım', 'E-Posta Katılım', 'SMS Katılım', 'Manuel Giriş']];
  const data = records.map(record => [
    record.fields['AD SOYAD'] || '',
    record.fields['TELEFON'] || '',
    record.fields['E POSTA'] || '',
    record.fields['SON KATILIM DURUMU'] || '',
    record.fields['WP KATILIM DURUMU'] || '',
    record.fields['E POSTA KATILIM DURUMU'] || '',
    record.fields['SMS KATILIM DURUMU'] || '',
    record.fields['MANUEL GİRİŞ'] || ''
  ]);

  doc.autoTable({
    head: headers,
    body: data,
    theme: 'grid',
    styles: { 
      fontSize: 7,
      cellPadding: 1
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 20 }
    },
    margin: { top: 10 }
  });

  doc.save('katilimci-listesi.pdf');
  await logAction('export_pdf', { recordCount: records.length });
};

const exportToImage = async (tableRef) => {
  try {
    const canvas = await html2canvas(tableRef.current);
    canvas.toBlob(async (blob) => {
      saveAs(blob, 'katilimci-listesi.jpg');
      await logAction('export_image', { recordCount: tableRef.current.querySelectorAll('tbody tr').length });
    });
  } catch (err) {
    console.error('Image export failed:', err);
  }
};

const exportToWord = async (records) => {
  const headers = ['Ad Soyad', 'Telefon', 'E-Posta', 'Son Katılım', 'WP Katılım', 'E-Posta Katılım', 'SMS Katılım', 'Manuel Giriş'];
  let htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${records.map(record => `
              <tr>
                <td>${record.fields['AD SOYAD'] || ''}</td>
                <td>${record.fields['TELEFON'] || ''}</td>
                <td>${record.fields['E POSTA'] || ''}</td>
                <td>${record.fields['SON KATILIM DURUMU'] || ''}</td>
                <td>${record.fields['WP KATILIM DURUMU'] || ''}</td>
                <td>${record.fields['E POSTA KATILIM DURUMU'] || ''}</td>
                <td>${record.fields['SMS KATILIM DURUMU'] || ''}</td>
                <td>${record.fields['MANUEL GİRİŞ'] || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'application/msword' });
  saveAs(blob, 'katilimci-listesi.doc');
  await logAction('export_word', { recordCount: records.length });
};

function AirtableData() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const tableRef = useRef(null);

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
        setRecords(response.data.records);
        setFilteredRecords(response.data.records);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Veriler çekilirken hata oluştu.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...records].sort((a, b) => 
      new Date(b.createdTime) - new Date(a.createdTime)
    );

    if (searchTerm) {
      filtered = filtered.filter((record) =>
        record.fields['AD SOYAD']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((record) => record.fields['SON KATILIM DURUMU'] === statusFilter);
    }

    setFilteredRecords(filtered);
  }, [searchTerm, statusFilter, records]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.relative')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'KATILACAĞIM':
        return 'bg-green-500 text-white font-medium';
      case 'GELMEYECEĞİM':
        return 'bg-red-500 text-white font-medium';
      case 'TELEFON İLE ARA':
        return 'bg-yellow-400 text-yellow-900 font-medium';
      case 'ULAŞMADI':
        return 'bg-orange-500 text-white font-medium';
      default:
        return 'bg-gray-500 text-white font-medium';
    }
  };

  if (loading) {
    return <p className="text-center text-muted-light dark:text-muted-dark">Yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-soft-dark">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">Kullanıcı Verileri</h3>
          
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-green-600 dark:hover:bg-purple-700 text-sm font-medium flex items-center space-x-2 transition-colors duration-300"
            >
              <span>Dışa Aktar</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card-light dark:bg-card-dark rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      exportToCSV(filteredRecords);
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 text-left flex items-center space-x-2 transition-colors duration-300"
                  >
                    <span className="w-4 h-4 text-green-600 dark:text-green-400">📄</span>
                    <span>CSV olarak indir</span>
                  </button>
                  <button
                    onClick={() => {
                      exportToExcel(filteredRecords);
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 text-left flex items-center space-x-2 transition-colors duration-300"
                  >
                    <span className="w-4 h-4 text-green-600 dark:text-green-400">📊</span>
                    <span>Excel olarak indir</span>
                  </button>
                  <button
                    onClick={() => {
                      exportToPDF(filteredRecords);
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 text-left flex items-center space-x-2 transition-colors duration-300"
                  >
                    <span className="w-4 h-4 text-red-600 dark:text-red-400">📑</span>
                    <span>PDF olarak indir</span>
                  </button>
                  <button
                    onClick={() => {
                      exportToImage(tableRef);
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 text-left flex items-center space-x-2 transition-colors duration-300"
                  >
                    <span className="w-4 h-4 text-purple-600 dark:text-purple-400">🖼️</span>
                    <span>Resim olarak indir</span>
                  </button>
                  <button
                    onClick={() => {
                      exportToWord(filteredRecords);
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 text-left flex items-center space-x-2 transition-colors duration-300"
                  >
                    <span className="w-4 h-4 text-blue-600 dark:text-blue-400">📝</span>
                    <span>Word olarak indir</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 mb-4 md:mb-0">
            <label className="block text-muted-light dark:text-muted-dark mb-1 text-sm" htmlFor="search">
              İsim ile Ara
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İsim girin..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark transition-colors duration-300"
            />
          </div>

          <div className="flex-1">
            <label className="block text-muted-light dark:text-muted-dark mb-1 text-sm" htmlFor="statusFilter">
              Katılım Durumu
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark transition-colors duration-300"
            >
              <option value="">Tümü</option>
              <option value="KATILACAĞIM">KATILACAĞIM</option>
              <option value="GELMEYECEĞİM">GELMEYECEĞİM</option>
              <option value="TELEFON İLE ARA">TELEFON İLE ARA</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto relative" ref={tableRef}>
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">✔</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Ad Soyad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Telefon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">E-Posta</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Son Katılım</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">WP Katılım</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">E-Posta Katılım</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">SMS Katılım</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Manuel Giriş</th>
                  </tr>
                </thead>
                <tbody className="bg-card-light dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredRecords.map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? 'bg-card-light dark:bg-card-dark' : 'bg-gray-50 dark:bg-gray-800'}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input type="checkbox" className="h-4 w-4 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark border-gray-300 dark:border-gray-600 rounded" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        {record.fields['AD SOYAD'] || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        {record.fields['TELEFON'] || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        {record.fields['E POSTA'] || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusClass(record.fields['SON KATILIM DURUMU'])}`}>
                          {record.fields['SON KATILIM DURUMU'] || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusClass(record.fields['WP KATILIM DURUMU'])}`}>
                          {record.fields['WP KATILIM DURUMU'] || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusClass(record.fields['E POSTA KATILIM DURUMU'])}`}>
                          {record.fields['E POSTA KATILIM DURUMU'] || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusClass(record.fields['SMS KATILIM DURUMU'])}`}>
                          {record.fields['SMS KATILIM DURUMU'] || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusSelector
                          recordId={record.id}
                          currentStatus={record.fields['MANUEL GİRİŞ']}
                          onStatusChange={(newStatus) => {
                            const updatedRecords = records.map(r =>
                              r.id === record.id
                                ? { ...r, fields: { ...r.fields, 'MANUEL GİRİŞ': newStatus }}
                                : r
                            );
                            setRecords(updatedRecords);
                            setFilteredRecords(updatedRecords);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirtableData;