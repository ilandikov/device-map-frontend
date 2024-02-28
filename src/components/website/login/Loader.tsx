import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';

export function Loader() {
    const { t } = useI18next();
    return (
        <div className="login-modal-loader-container">
            <div className="login-modal-loader"></div>
            <p className="login-modal-loader-text">{t('checking')}</p>
        </div>
    );
}
