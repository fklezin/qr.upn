import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { UpnData } from '../types';
import { RefreshCwIcon, Share2Icon, CheckIcon, DownloadIcon, CopyIcon } from './Icons';
import { translations } from '../translations';
import { trackEvent } from '../services/analyticsService';

interface ResultDisplayProps {
  upnData: UpnData;
  epcPayload: string;
  onReset: () => void;
  t: (key: keyof typeof translations, ...args: any[]) => string;
}

const DataRow: React.FC<{ label: string; value: string | undefined | boolean }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '') return null;
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
  return (
    <div className="flex justify-between items-start py-2 border-b border-brand-gray-light">
      <span className="text-sm text-brand-gray">{label}</span>
      <span className="text-sm text-right text-brand-text font-medium">{displayValue}</span>
    </div>
  );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ upnData, epcPayload, onReset, t }) => {
  const [isEpcCopied, setIsEpcCopied] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const getQrCodeAsBlob = (format: 'image/png' | 'image/jpeg' = 'image/png'): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const svgElement = qrCodeRef.current?.querySelector('svg');
        if (!svgElement) {
            resolve(null);
            return;
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            resolve(null);
            return;
        }

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            canvas.toBlob((blob) => {
                resolve(blob);
            }, format);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(null);
        };

        img.src = url;
    });
  };

  const handleDownload = async () => {
    const blob = await getQrCodeAsBlob();
    if (!blob) {
      alert('Could not generate image for download.');
      trackEvent('download_qr', 'Engagement', 'failed');
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'epc-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackEvent('download_qr', 'Engagement', 'success');
  };

  const handleShareImage = async () => {
    const blob = await getQrCodeAsBlob();
    if (!blob) {
        alert('Could not generate image for sharing.');
        trackEvent('share_image', 'Sharing', 'generation_failed');
        return;
    }

    const file = new File([blob], 'epc-qr-code.png', { type: blob.type });
    const shareData = {
        files: [file],
        title: t('shareTitle'),
        text: t('shareText'),
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
            trackEvent('share_image', 'Sharing', 'native_share_success');
        } catch (err) {
            console.error("Share image failed:", err);
            trackEvent('share_image', 'Sharing', 'native_share_failed');
        }
    } else {
        alert(t('shareImageNotSupported'));
        trackEvent('share_image', 'Sharing', 'not_supported');
    }
  };
  
  const handleCopyEpcPayload = async () => {
    try {
        await navigator.clipboard.writeText(epcPayload);
        setIsEpcCopied(true);
        trackEvent('copy_epc_payload', 'Engagement', 'success');
        setTimeout(() => setIsEpcCopied(false), 2000);
    } catch (err) {
        console.error("Failed to copy EPC payload:", err);
        trackEvent('copy_epc_payload', 'Engagement', 'failed');
        alert(t('copyEpcFailAlert'));
    }
  };

  const displayAmount = (() => {
    if (!upnData.amount) return '0.00 EUR';
    const normalized = upnData.amount.trim().replace(',', '.');
    let amountValue: number;

    if (!normalized.includes('.')) {
      const cents = parseInt(normalized, 10);
      amountValue = isNaN(cents) ? NaN : cents / 100;
    } else {
      amountValue = parseFloat(normalized);
    }

    if (isNaN(amountValue)) return t('ERROR_INVALID_AMOUNT');
    return `${amountValue.toFixed(2)} EUR`;
  })();


  return (
    <div className="bg-white border border-brand-gray-light p-6 rounded-lg shadow-sm w-full max-w-md mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold text-brand-primary mb-2">{t('resultTitle')}</h2>
      <p className="text-brand-gray mb-6 text-center">{t('resultDescription')}</p>
      
      <div ref={qrCodeRef} className="bg-white p-4 rounded-lg mb-6">
        <QRCodeSVG
          value={epcPayload}
          size={256}
          level="M"
          includeMargin={true}
        />
      </div>

      <div className="w-full mb-6 bg-brand-light-dark p-4 rounded-lg border border-brand-gray-light">
        <h3 className="text-lg font-semibold text-brand-text mb-2">{t('howToPayTitle')}</h3>
        <ol className="list-decimal list-inside space-y-1 text-brand-gray-dark text-sm">
            <li>{t('howToPayStep1')}</li>
            <li>{t('howToPayStep2')}</li>
            <li>{t('howToPayStep3')}</li>
        </ol>
      </div>

      <div className="w-full mb-6">
        <h3 className="text-lg font-semibold text-brand-text mb-2 text-center border-b border-brand-gray-light pb-2">{t('originalDataTitle')}</h3>
        <div className="mt-2">
          <DataRow label={t('recipient')} value={upnData.recipientName} />
          <DataRow label={t('iban')} value={upnData.recipientIBAN} />
          <DataRow label={t('amount')} value={displayAmount} />
          <DataRow label={t('purpose')} value={upnData.purpose} />
          <DataRow label={t('reference')} value={upnData.recipientReference} />
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
                onClick={handleDownload}
                className="w-full bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                <DownloadIcon className="w-5 h-5" />
                {t('downloadImage')}
            </button>
            <button
                onClick={handleShareImage}
                className="w-full bg-white text-brand-primary font-semibold py-3 px-6 rounded-lg hover:bg-brand-light-dark transition-colors border-2 border-brand-primary shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                <Share2Icon className="w-5 h-5" />
                {t('shareImage')}
            </button>
        </div>
        <button
            onClick={handleCopyEpcPayload}
            className="w-full bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
            {isEpcCopied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
            {isEpcCopied ? t('epcPayloadCopied') : t('copyEpcPayload')}
        </button>
        <button
            onClick={onReset}
            className="w-full bg-white text-brand-gray font-medium py-2 px-6 rounded-lg hover:bg-brand-light-dark transition-colors flex items-center justify-center gap-2 border border-brand-gray-light"
            >
            <RefreshCwIcon className="w-5 h-5" />
            {t('scanAnother')}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;