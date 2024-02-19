import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { LoginModalHeader } from './LoginModalHeader';

export enum LoginModalHeaderState {
    WELCOME = 'WELCOME',
    SIGNUP = 'SIGNUP',
    LOGIN = 'LOGIN',
    NEW_PASSWORD = 'NEW_PASSWORD',
}

export function WelcomeHeader(props: { state: LoginModalHeaderState }) {
    const { t } = useI18next();

    let header = `${t('brand')} ${t('map')}`;
    let description = t('loginCallToAction');
    let opaqueDescription = false;

    if (props.state === LoginModalHeaderState.SIGNUP) {
        header = t('signUp');
        description = t('finikMapProductDescription');
        opaqueDescription = true;
    }

    if (props.state === LoginModalHeaderState.LOGIN) {
        header = t('logIn');
        description = t('finikMapProductDescription');
        opaqueDescription = true;
    }

    if (props.state === LoginModalHeaderState.NEW_PASSWORD) {
        header = t('newPassword');
        description = t('finikMapProductDescription');
        opaqueDescription = true;
    }

    return <LoginModalHeader {...{ header, description, opaqueDescription }} />;
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
