import React from 'react';
import { translations } from '../translations';
import { ArrowLeftIcon } from './Icons';

interface BlogProps {
  onBack: () => void;
  t: (key: keyof typeof translations, ...args: any[]) => string;
}

const BlogSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-brand-blue mb-3">{title}</h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
            {children}
        </div>
    </div>
);

const Blog: React.FC<BlogProps> = ({ onBack, t }) => {
  return (
    <div className="bg-brand-light-dark p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl mx-auto">
        <header className="flex items-center mb-8">
            <button
                onClick={onBack}
                className="mr-4 p-2 rounded-full text-brand-gray hover:bg-brand-dark hover:text-white transition-colors"
                aria-label={t('blogBackToApp')}
            >
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">{t('blogTitle')}</h1>
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
                className="w-full sm:w-auto bg-brand-blue text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                {t('blogBackToApp')}
            </button>
        </div>
    </div>
  );
};

export default Blog;