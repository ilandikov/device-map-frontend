import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

export function ErrorMessage(props: { error: Error }) {
    const { t } = useI18next();
    return (
        <>{props.error && <p className="login-modal-input-help login-modal-wrong-input">{t(props.error.message)}</p>}</>
    );
}
