import React from 'react';
import { translations } from '../translations';
import { XIcon } from './Icons';

interface InfoModalProps {
  onClose: () => void;
  t: (key: keyof typeof translations, ...args: any[]) => string;
}

const InfoSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-brand-text mb-2 border-b border-brand-gray-light pb-2">{title}</h3>
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
        className="bg-white border border-brand-gray-light rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing the modal
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-brand-gray hover:text-brand-primary transition-colors"
            aria-label={t('infoClose')}
        >
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-brand-primary mb-6 border-b border-brand-primary/20 pb-3">{t('infoTitle')}</h2>

        <InfoSection title={t('infoWhatItDoes')}>
            <p className="text-brand-gray-dark">{t('infoWhatItDoesText')}</p>
        </InfoSection>

        <InfoSection title={t('infoHowToUse')}>
            <ol className="list-decimal list-inside space-y-2 text-brand-gray-dark">
                <li>{t('infoStep1')}</li>
                <li>{t('infoStep2')}</li>
                <li>{t('infoStep3')}</li>
            </ol>
        </InfoSection>
        
        <InfoSection title={t('infoPrivacy')}>
             <p className="text-brand-gray-dark">{t('infoPrivacyText')}</p>
        </InfoSection>

        <div className="text-center mt-8">
            <button
                onClick={onClose}
                className="bg-brand-primary text-white font-semibold py-2 px-8 rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm hover:shadow-md"
            >
                {t('infoClose')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
