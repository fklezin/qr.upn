import React from 'react';
import { translations } from '../translations';
import { XIcon } from './Icons';

interface InfoModalProps {
  onClose: () => void;
  t: (key: keyof typeof translations, ...args: any[]) => string;
}

const InfoSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2 border-b border-brand-gray/50 pb-2">{title}</h3>
        {children}
    </div>
);

const InfoModal: React.FC<InfoModalProps> = ({ onClose, t }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-brand-light-dark rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing the modal
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-brand-gray hover:text-white transition-colors"
            aria-label={t('infoClose')}
        >
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-brand-blue mb-6">{t('infoTitle')}</h2>

        <InfoSection title={t('infoWhatItDoes')}>
            <p className="text-gray-300">{t('infoWhatItDoesText')}</p>
        </InfoSection>

        <InfoSection title={t('infoHowToUse')}>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>{t('infoStep1')}</li>
                <li>{t('infoStep2')}</li>
                <li>{t('infoStep3')}</li>
            </ol>
        </InfoSection>
        
        <InfoSection title={t('infoPrivacy')}>
             <p className="text-gray-300">{t('infoPrivacyText')}</p>
        </InfoSection>

        <div className="text-center mt-8">
            <button
                onClick={onClose}
                className="bg-brand-blue text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-600 transition-colors"
            >
                {t('infoClose')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
