
import React, { useState } from 'react';
import { UpnData } from './types';
import { parseUpnString, convertUpnToEpc } from './services/conversionService';
import Scanner from './components/Scanner';
import ResultDisplay from './components/ResultDisplay';
import { CameraIcon, QrCodeIcon } from './components/Icons';

type AppStatus = 'idle' | 'scanning' | 'success' | 'error';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [upnData, setUpnData] = useState<UpnData | null>(null);
  const [epcString, setEpcString] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleScanSuccess = (decodedText: string) => {
    try {
      const trimmedText = decodedText.trim();
      if (!trimmedText.startsWith('UPNQR')) {
        throw new Error('This does not appear to be a valid UPN QR code.');
      }
      const parsedUpn = parseUpnString(trimmedText);
      const convertedEpc = convertUpnToEpc(parsedUpn);
      setUpnData(parsedUpn);
      setEpcString(convertedEpc);
      setStatus('success');
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred during parsing.';
      setError(message);
      setStatus('error');
    }
  };
  
  const handleScanError = (errorMessage: string) => {
    setError(`Camera error: ${errorMessage}`);
    setStatus('error');
  };

  const handleReset = () => {
    setStatus('idle');
    setUpnData(null);
    setEpcString('');
    setError('');
  };

  const renderContent = () => {
    switch (status) {
      case 'scanning':
        return <Scanner onSuccess={handleScanSuccess} onError={handleScanError} onCancel={() => setStatus('idle')} />;
      case 'success':
        return upnData && <ResultDisplay upnData={upnData} epcPayload={epcString} onReset={handleReset} />;
      case 'error':
        return (
          <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Scan Failed</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={handleReset}
              className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="text-center p-8">
            <div className="mx-auto mb-6 bg-brand-light-dark p-4 rounded-full w-24 h-24 flex items-center justify-center">
              <QrCodeIcon className="w-12 h-12 text-brand-blue" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">UPN to EPC QR Converter</h1>
            <p className="text-brand-gray max-w-md mx-auto mb-8">
              Scan a Slovenian UPN bill's QR code to convert it into a standard EPC QR code, perfect for payment apps like Revolut.
            </p>
            <button
              onClick={() => setStatus('scanning')}
              className="w-full sm:w-auto bg-brand-blue text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto gap-2"
            >
              <CameraIcon className="w-6 h-6" />
              Start Scanning
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-gray-200 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </main>
      <footer className="text-center text-brand-gray text-sm p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} UPN to EPC Converter. Built for simplicity.</p>
      </footer>
    </div>
  );
};

export default App;
