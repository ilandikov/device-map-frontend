import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { LoginModalHeader } from './LoginModalHeader';

export enum LoginModalHeaderState {
    WELCOME = 'WELCOME',
}

export function WelcomeHeader(props: { state: LoginModalHeaderState }) {
    const { t } = useI18next();

    return (
        <LoginModalHeader
            header={`${t('brand')} ${t('map')}`}
            description={t('loginCallToAction')}
            opaqueDescription={false}
        />
    );
}

export function SignUpHeader() {
    const { t } = useI18next();

    return (
        <LoginModalHeader header={t('signUp')} description={t('finikMapProductDescription')} opaqueDescription={true} />
    );
}

export function LogInHeader() {
    const { t } = useI18next();

    return (
        <LoginModalHeader header={t('logIn')} description={t('finikMapProductDescription')} opaqueDescription={true} />
    );
}

export function NewPasswordHeader() {
    const { t } = useI18next();

    return (
        <LoginModalHeader
            header={t('newPassword')}
            description={t('finikMapProductDescription')}
            opaqueDescription={true}
        />
    );
}
