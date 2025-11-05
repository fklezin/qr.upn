import React from 'react';
import { translations } from '../translations';
import { ArrowLeftIcon } from './Icons';

interface BlogProps {
  onBack: () => void;
  t: (key: keyof typeof translations, ...args: any[]) => string;
}

const BlogSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-brand-primary mb-3 border-b border-brand-primary/20 pb-2">{title}</h2>
        <div className="space-y-4 text-brand-gray-dark leading-relaxed">
            {children}
        </div>
    </div>
);

const Blog: React.FC<BlogProps> = ({ onBack, t }) => {
  return (
    <div className="bg-white border border-brand-gray-light p-4 sm:p-6 md:p-8 rounded-lg shadow-sm w-full max-w-2xl mx-auto">
        <header className="flex items-center mb-6 sm:mb-8 border-b border-brand-gray-light pb-4">
            <button
                onClick={onBack}
                className="mr-3 sm:mr-4 p-2 rounded-full text-brand-gray hover:bg-brand-light-dark hover:text-brand-primary transition-colors flex-shrink-0 border border-transparent hover:border-brand-primary"
                aria-label={t('blogBackToApp')}
            >
                <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-text break-words">{t('blogTitle')}</h1>
        </header>
        
        <article>
            <p className="text-lg text-brand-gray mb-8 italic">{t('blogIntro')}</p>

            <BlogSection title={t('blogSection1Title')}>
                <p>{t('blogSection1P1')}</p>
            </BlogSection>

            <BlogSection title={t('blogSection2Title')}>
                <p>{t('blogSection2P1')}</p>
            </BlogSection>

            <BlogSection title={t('blogSection3Title')}>
                <p>{t('blogSection3P1')}</p>
            </BlogSection>

            <BlogSection title={t('blogSection4Title')}>
                <p>{t('blogSection4P1')}</p>
                <ul className="list-disc list-inside space-y-2 pl-4 font-medium text-white">
                    {t('blogSection4List').split('\n').map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <p>{t('blogSection4P2')}</p>
            </BlogSection>
        </article>

        <div className="text-center mt-10">
            <button
                onClick={onBack}
                className="w-full sm:w-auto bg-brand-primary text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-brand-primary-hover transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                {t('blogBackToApp')}
            </button>
        </div>
    </div>
  );
};

export default Blog;