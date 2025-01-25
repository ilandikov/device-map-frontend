import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { DeviceItemContainer } from './DeviceItemContainer';
import { CreateAccountOrLoginButton } from './CreateAccountOrLoginButton';
import { AddDeviceButton } from './AddDeviceButton';

export function CreateDeviceItem(props: { isUserLoggedIn: boolean }) {
    const { t } = useI18next();

    const { isUserLoggedIn } = props;

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            {isUserLoggedIn ? <AddDeviceButton /> : <CreateAccountOrLoginButton />}
        </DeviceItemContainer>
    );
}
