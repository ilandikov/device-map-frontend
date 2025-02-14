import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useMapAppState } from '../redux/MapAppState';
import { DeviceItemContainer } from './DeviceItemContainer';
import { CreateAccountOrLoginButton } from './CreateAccountOrLoginButton';
import { CreateDeviceButton } from './CreateDeviceButton';

export function CreateDeviceItem() {
    const { t } = useI18next();

    const { loggedInUser } = useMapAppState();

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            {loggedInUser ? <CreateDeviceButton /> : <CreateAccountOrLoginButton />}
        </DeviceItemContainer>
    );
}
