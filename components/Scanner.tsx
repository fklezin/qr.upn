import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, FlashlightIcon, FlashlightOffIcon } from './Icons';
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
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [flashlightSupported, setFlashlightSupported] = useState(false);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const flashlightOnRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
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

        // Get the video track for flashlight control
        // Use a small delay to ensure the video element is ready
        timeoutId = setTimeout(() => {
          if (!isMounted) return;
          
          const qrReaderElement = document.getElementById(qrReaderElementId);
          if (qrReaderElement) {
            const videoElement = qrReaderElement.querySelector('video') as HTMLVideoElement;
            if (videoElement && videoElement.srcObject) {
              const stream = videoElement.srcObject as MediaStream;
              const videoTrack = stream.getVideoTracks()[0];
              if (videoTrack) {
                videoTrackRef.current = videoTrack;
                
                // Check if torch is supported
                const capabilities = videoTrack.getCapabilities();
                if (capabilities && 'torch' in capabilities) {
                  setFlashlightSupported(true);
                }
              }
            }
          }
        }, 100);
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
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Turn off flashlight before cleanup
      if (videoTrackRef.current && flashlightOnRef.current) {
        videoTrackRef.current.applyConstraints({ advanced: [{ torch: false }] as any }).catch(() => {});
      }
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner on cleanup.", err));
      }
    };
  }, [onSuccess, onError]);

  const toggleFlashlight = async () => {
    if (!videoTrackRef.current || !flashlightSupported) return;

    try {
      const newState = !flashlightOn;
      await videoTrackRef.current.applyConstraints({
        advanced: [{ torch: newState }] as any
      });
      setFlashlightOn(newState);
      flashlightOnRef.current = newState;
    } catch (err) {
      console.error('Failed to toggle flashlight:', err);
      // If it fails, assume it's not supported
      setFlashlightSupported(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white border border-brand-gray-light rounded-lg shadow-sm relative">
      <div id={qrReaderElementId} className="w-full rounded-md overflow-hidden" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80%] h-[80%] max-w-xs max-h-xs border-4 border-brand-primary/60 rounded-lg shadow-inner" style={{boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'}}></div>
      </div>
      <button 
        onClick={onCancel} 
        className="absolute top-4 left-4 bg-white border border-brand-primary text-brand-primary rounded-full p-2 hover:bg-brand-primary hover:text-white transition-colors shadow-sm"
        aria-label={t('scannerCancel')}
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      {flashlightSupported && (
        <button 
          onClick={toggleFlashlight} 
          className="absolute top-4 right-4 bg-white border border-brand-primary text-brand-primary rounded-full p-2 hover:bg-brand-primary hover:text-white transition-colors shadow-sm"
          aria-label={flashlightOn ? t('flashlightOff') : t('flashlightOn')}
          title={flashlightOn ? t('flashlightOff') : t('flashlightOn')}
        >
          {flashlightOn ? (
            <FlashlightIcon className="w-6 h-6" />
          ) : (
            <FlashlightOffIcon className="w-6 h-6" />
          )}
        </button>
      )}
    </div>
  );
};

export default Scanner;