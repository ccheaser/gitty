import { useEffect, useState } from 'react';

function RegisterForm() {
  const formID = '250983842247061';
  const [frameHeight, setFrameHeight] = useState('650px'); // Daha uygun bir başlangıç yüksekliği

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'setHeight') {
        // Form yüksekliğine biraz ekstra alan ekle (buton için)
        setFrameHeight(`${Math.min(event.data.height + 50, 700)}px`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 md:p-6 bg-gradient-to-r from-green-500 to-green-600">
          <h2 className="text-xl md:text-2xl font-bold text-white text-center">Katılım Formu</h2>
        </div>
        
        <div className="flex justify-center items-center">
          <div className="w-full">
            <iframe
              id={`JotFormIFrame-${formID}`}
              title="Kayıt Formu"
              allowTransparency="true"
              allowFullScreen={true}
              allow="geolocation; microphone; camera"
              src={`https://form.jotform.com/${formID}?hideHeader=true&novalidate=true`}
              frameBorder="0"
              style={{
                width: '100%',
                height: frameHeight,
                border: 'none',
                backgroundColor: 'transparent',
                minHeight: '950px', // Minimum yükseklik azaltıldı
                display: 'block',
                margin: '0 auto'
              }}
              scrolling="no"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;