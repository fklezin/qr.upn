import React, { useEffect, useRef } from 'react';
import { ArrowLeftIcon } from './Icons';
import { translations } from '../translations';

interface ScannerProps {
  onSuccess: (decodedText: string) => void;
  onError: (errorMessage: string) => void;
  onCancel: () => void;
  t: (key: keyof typeof translations, ...args: any[]) => string;
}

const qrReaderElementId = 'qr-reader';

interface Html5QrcodeInstance {
    start: (...args: any[]) => Promise<null>;
    stop: () => Promise<void>;
    isScanning: boolean;
}

const Scanner: React.FC<ScannerProps> = ({ onSuccess, onError, onCancel, t }) => {
  const scannerRef = useRef<Html5QrcodeInstance | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!isMounted) return;

        const scanner = new Html5Qrcode(qrReaderElementId) as Html5QrcodeInstance;
        scannerRef.current = scanner;

        if (scanner.isScanning) {
            return;
        }

        await scanner.start(
          { facingMode: 'environment' },
          { 
            fps: 10, 
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.8);
              return { width: qrboxSize, height: qrboxSize };
            },
            aspectRatio: 1.0
          },
          (decodedText, _) => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().then(() => onSuccess(decodedText)).catch(err => console.error("Failed to stop scanner on success", err));
            }
          },
          (_) => {
            // This is the error callback, which is called frequently for non-critical errors.
          }
        );
      } catch (err) {
        if (isMounted) {
            const message = err instanceof Error ? err.message : 'Failed to start camera.';
            onError(message);
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner on cleanup.", err));
      }
    };
  }, [onSuccess, onError]);

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-brand-light-dark rounded-lg shadow-lg relative">
      <div id={qrReaderElementId} className="w-full rounded-md overflow-hidden" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80%] h-[80%] max-w-xs max-h-xs border-4 border-white/50 rounded-lg shadow-inner" style={{boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'}}></div>
      </div>
      <button 
        onClick={onCancel} 
        className="absolute top-4 left-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-colors"
        aria-label={t('scannerCancel')}
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Scanner;