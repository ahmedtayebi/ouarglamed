// PATH: src/components/SEO/PageSEO.jsx

import { Helmet } from 'react-helmet-async';
import siteData from '@data/siteData';

/**
 * SEO component using React Helmet for meta tags.
 * @param {{ title?: string, description?: string, keywords?: string }} props
 */
const PageSEO = ({ title, description, keywords }) => {
    const { seo } = siteData;

    const fullTitle = title ? `${title} | ${seo.defaultTitle}` : seo.defaultTitle;
    const metaDescription = description || seo.defaultDescription;
    const metaKeywords = keywords || seo.defaultKeywords;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <html lang="ar" dir="rtl" />
        </Helmet>
    );
};

export default PageSEO;
