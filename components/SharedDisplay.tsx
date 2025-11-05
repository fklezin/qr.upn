import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCodeIcon } from './Icons';
import { translations } from '../translations';

interface SharedDisplayProps {
  epcString: string;
  t: (key: keyof typeof translations, ...args: any[]) => string;
}

const SharedDisplay: React.FC<SharedDisplayProps> = ({ epcString, t }) => {
  return (
    <div className="bg-white border border-brand-gray-light p-6 rounded-lg shadow-sm w-full max-w-md mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold text-brand-primary mb-2">{t('sharedTitle')}</h2>
        <p className="text-brand-gray mb-6 text-center">{t('sharedDescription')}</p>
        <div className="bg-white p-4 rounded-lg mb-6">
            <QRCodeSVG value={epcString} size={256} level="M" includeMargin={true} />
        </div>
        <a
            href={window.location.origin + window.location.pathname}
            className="w-full bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
            <QrCodeIcon className="w-5 h-5" />
            {t('createYourOwn')}
        </a>
    </div>
  );
};

export default SharedDisplay;
