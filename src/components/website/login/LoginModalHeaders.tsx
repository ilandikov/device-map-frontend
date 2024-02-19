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
    function getHeaderDetails() {
        const { t } = useI18next();

        const header = `${t('brand')} ${t('map')}`;
        const description = t('loginCallToAction');
        const opaqueDescription = false;

        if (props.state === LoginModalHeaderState.SIGNUP) {
            return {
                header: t('signUp'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        }

        if (props.state === LoginModalHeaderState.LOGIN) {
            return {
                header: t('logIn'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        }

        if (props.state === LoginModalHeaderState.NEW_PASSWORD) {
            return {
                header: t('newPassword'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        }
        return { header, description, opaqueDescription };
    }

    const { header, description, opaqueDescription } = getHeaderDetails();

    return <LoginModalHeader {...{ header, description, opaqueDescription }} />;
}
