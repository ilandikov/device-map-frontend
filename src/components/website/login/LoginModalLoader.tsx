import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import './LoginModalLoader.scss';
import { FinikLoader } from '../common/FinikLoader';

export function LoginModalLoader() {
    const { t } = useI18next();
    return (
        <div className="login-modal-loader-container">
            <FinikLoader />
            <p className="login-modal-loader-text">{t('checking')}</p>
        </div>
    );
}
