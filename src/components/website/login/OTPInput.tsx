import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';

export function OTPInput() {
    const { t } = useI18next();
    return (
        <div className="login-modal-input-outer-container">
            <p className="login-modal-input-description">{t('OTPEnter')}</p>
            <div className="login-modal-input-otp-container">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                        type="number"
                        pattern="[0-9]"
                        maxLength={1}
                        key={`OTPInput${index}`}
                        data-testid={`OTPInput${index}`}
                    />
                ))}
            </div>
            <p className="login-modal-input-description login-modal-opaque-text">{t('OTPExplanation')}</p>
            <p className="login-modal-input-description login-modal-correct-input">{t('OTPSendAgain')}</p>
        </div>
    );
}
