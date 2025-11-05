import React, { useState, useRef, useEffect } from 'react';
import { UpnData } from './types';
import { parseUpnString, convertUpnToEpc } from './services/conversionService';
import { CameraIcon, QrCodeIcon, UploadCloudIcon, GlobeIcon, InfoIcon, FileTextIcon } from './components/Icons';
import { translations } from './translations';
import { trackEvent } from './services/analyticsService';

const Scanner = React.lazy(() => import('./components/Scanner'));
const ResultDisplay = React.lazy(() => import('./components/ResultDisplay'));
const InfoModal = React.lazy(() => import('./components/InfoModal'));
const ImageCropModal = React.lazy(() => import('./components/ImageCropModal'));
const Blog = React.lazy(() => import('./components/Blog'));
const SharedDisplay = React.lazy(() => import('./components/SharedDisplay'));


type AppStatus = 'idle' | 'scanning' | 'success' | 'error' | 'shared';
type Language = 'en' | 'sl';
type View = 'main' | 'blog';

const fileScannerElementId = 'file-scanner-container';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>('idle');
  const [upnData, setUpnData] = useState<UpnData | null>(null);
  const [epcString, setEpcString] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [lang, setLang] = useState<Language>('en');
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [view, setView] = useState<View>('main');
  const [isCropping, setIsCropping] = useState(false);
  const [imageSrcForCrop, setImageSrcForCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileScannerRef = useRef<any | null>(null);

  const t = (key: keyof typeof translations, ...args: any[]) => {
    const value = translations[key][lang];
    if (typeof value === 'function') {
      return (value as Function)(...args);
    }
    return value;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');

    if (data) {
        try {
            const decodedData = atob(data);
            if (decodedData.startsWith('BCD\n')) {
                setEpcString(decodedData);
                setStatus('shared');
                trackEvent('shared_link_opened', 'Sharing', 'success');
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                setError(t('errorInvalidSharedLink'));
                trackEvent('shared_link_opened', 'Sharing', 'invalid_data');
                setStatus('error');
            }
        } catch (e) {
            setError(t('errorInvalidSharedLink'));
            trackEvent('shared_link_opened', 'Sharing', 'decoding_error');
            setStatus('error');
        }
    }
  }, []);

  const handleScanSuccess = (decodedText: string | null | undefined, source: 'camera' | 'upload') => {
    const originalScan = decodedText || '';
    if (!decodedText || decodedText.trim() === '') {
      const tips = t('scanTips').split('\n');
      const message = `${t('errorEmptyScan')}\n\n${t('scanTipsTitle')}\n- ${tips.join('\n- ')}`;
      const finalMessage = `${message}\n\n--- ${t('rawContentTitle')} ---\n'${originalScan}'`;
      setError(finalMessage);
      trackEvent('conversion_error', 'Conversion', `${source}: empty_scan`);
      setStatus('error');
      return;
    }

    const cleanText = decodedText.startsWith('\uFEFF') ? decodedText.slice(1) : decodedText;

    try {
      const parsedUpn = parseUpnString(cleanText);
      const convertedEpc = convertUpnToEpc(parsedUpn);
      setUpnData(parsedUpn);
      setEpcString(convertedEpc);
      setStatus('success');
      trackEvent('conversion_success', 'Conversion', source);
      setError('');
    } catch (err) {
      let message = t('errorUnknown');
      let errorKey = 'unknown_error';
      if (err instanceof Error) {
        errorKey = err.message;
        const translationKey = errorKey as keyof typeof translations;
        if (translations[translationKey]) {
          const details = (err as any).details || [];
          message = t(translationKey, ...details);
        } else {
          message = err.message;
        }
      }
      const finalMessage = `${message}\n\n--- ${t('rawContentTitle')} ---\n'${cleanText}'`;
      setError(finalMessage);
      trackEvent('conversion_error', 'Conversion', `${source}: ${errorKey}`);
      setStatus('error');
    }
  };
  
  const handleScanError = (errorMessage: string) => {
    setError(`${t('errorCamera')} ${errorMessage}`);
    trackEvent('conversion_error', 'Conversion', `camera_start_fail: ${errorMessage}`);
    setStatus('error');
  };

  const handleReset = () => {
    setStatus('idle');
    setUpnData(null);
    setEpcString('');
    setError('');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
        setImageSrcForCrop(reader.result as string);
        setIsCropping(true);
    });
    reader.readAsDataURL(file);

    if(event.target) event.target.value = ''; // Reset file input
  };
  
  const handleCropCancel = () => {
      setIsCropping(false);
      setImageSrcForCrop(null);
  };

  const handleCropConfirm = async (croppedImageBlob: Blob) => {
    setIsCropping(false);
    setImageSrcForCrop(null);
    
    if (!fileScannerRef.current) {
      const { Html5Qrcode } = await import('html5-qrcode');
      fileScannerRef.current = new Html5Qrcode(fileScannerElementId, false);
    }
    
    const imageFile = new File([croppedImageBlob], "cropped-qr.png", { type: "image/png" });

    try {
      // Try scanFile, and fall back to scanFileV2 if available
      let decodedText: string | null | undefined;
      const scanner = fileScannerRef.current;
      if ((scanner as any).scanFile) {
        decodedText = await (scanner as any).scanFile(imageFile, false);
      } else if ((scanner as any).scanFileV2) {
        const result = await (scanner as any).scanFileV2(imageFile, false);
        decodedText = result?.decodedText;
      } else {
        throw new Error('scanFile method not available');
      }
      handleScanSuccess(decodedText, 'upload');
    } catch (err) {
      const message = err instanceof Error ? err.message : t('errorDecode');
      setError(`${t('errorFileUpload')} ${message}`);
      trackEvent('conversion_error', 'Conversion', `file_upload_fail_cropped: ${message}`);
      setStatus('error');
    } finally {
      // Ensure we release resources to allow subsequent uploads
      try {
        await fileScannerRef.current?.clear();
      } catch (_) {
        // ignore
      }
    }
  };

  const handleLanguageChange = () => {
    const newLang = lang === 'en' ? 'sl' : 'en';
    setLang(newLang);
    trackEvent('language_switch', 'Engagement', newLang);
  };
  
  const handleViewBlog = () => {
    setView('blog');
    trackEvent('view_blog', 'Engagement', 'header_click');
  }

  const renderMainContent = () => {
    switch (status) {
      case 'scanning':
        return <Scanner onSuccess={(text) => handleScanSuccess(text, 'camera')} onError={handleScanError} onCancel={() => setStatus('idle')} t={t} />;
      case 'success':
        return upnData && <ResultDisplay upnData={upnData} epcPayload={epcString} onReset={handleReset} t={t} />;
      case 'shared':
        return <SharedDisplay epcString={epcString} t={t} />;
      case 'error':
        return (
          <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{t('errorTitle')}</h2>
            <p className="mb-4 whitespace-pre-wrap text-left bg-brand-dark/50 p-3 rounded-md font-mono text-sm">
              {error}
            </p>
            <button
              onClick={handleReset}
              className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('errorTryAgain')}
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('title')}</h1>
            <p className="text-brand-gray max-w-md mx-auto mb-8">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button
                  onClick={() => setStatus('scanning')}
                  className="w-full sm:w-auto bg-brand-blue text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <CameraIcon className="w-6 h-6" />
                  {t('startScanning')}
                </button>
                <button
                  onClick={handleUploadClick}
                  className="w-full sm:w-auto bg-brand-light-dark text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 border border-brand-gray"
                >
                  <UploadCloudIcon className="w-6 h-6" />
                  {t('uploadImage')}
                </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              aria-hidden="true"
            />
          </div>
        );
    }
  };
  
  const renderContent = () => {
    if (view === 'blog') {
        return <Blog onBack={() => setView('main')} t={t} />;
    }
    return renderMainContent();
  };

  return (
    <div className="min-h-screen bg-brand-dark text-gray-200 flex flex-col items-center justify-center p-4 relative">
      <header className="absolute top-0 right-0 p-4 flex gap-3">
        <button 
            onClick={handleLanguageChange}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-gray hover:bg-brand-light-dark hover:text-white transition-colors"
            title="Change language / Spremeni jezik"
        >
            <GlobeIcon className="w-6 h-6" />
            <span className="font-bold text-sm">{lang.toUpperCase()}</span>
        </button>
        <button 
            onClick={handleViewBlog}
            className="p-2 rounded-full text-brand-gray hover:bg-brand-light-dark hover:text-white transition-colors"
            title={t('blogButtonTitle')}
        >
            <FileTextIcon className="w-6 h-6" />
        </button>
        <button 
            onClick={() => setInfoModalOpen(true)}
            className="p-2 rounded-full text-brand-gray hover:bg-brand-light-dark hover:text-white transition-colors"
            title="About this app / O aplikaciji"
        >
            <InfoIcon className="w-6 h-6" />
        </button>
      </header>

      <div id={fileScannerElementId} style={{ display: 'none' }}></div>
      <main className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </main>
      {isCropping && imageSrcForCrop && (
          <ImageCropModal 
            imageSrc={imageSrcForCrop}
            onConfirm={handleCropConfirm}
            onCancel={handleCropCancel}
            t={t}
          />
      )}
      <footer className="text-center text-brand-gray text-sm p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} {t('footerText')}</p>
      </footer>
      {isInfoModalOpen && <InfoModal onClose={() => setInfoModalOpen(false)} t={t} />}
    </div>
  );
};

export default App;