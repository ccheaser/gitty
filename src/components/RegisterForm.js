import { useEffect, useState } from 'react';

function RegisterForm() {
  const formID = '250983953018060'; // Register form ID'si (farklı bir ID gerekiyorsa lütfen belirtin)
  const [frameHeight, setFrameHeight] = useState('650px');

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'setHeight') {
        setFrameHeight(`${Math.min(event.data.height + 50, 700)}px`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft dark:shadow-soft-dark overflow-hidden">
        <div className="p-4 md:p-6 bg-gradient-to-r from-primary-light to-green-600 dark:from-primary-dark dark:to-purple-700">
          <h2 className="text-xl md:text-2xl font-bold text-white text-center">Katılım Formu</h2>
        </div>
        
        <div className="flex justify-center items-center">
          <div className="w-full">
            <iframe
              id={`JotFormIFrame-${formID}`}
              title="Katılım Formu"
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
                minHeight: '950px',
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