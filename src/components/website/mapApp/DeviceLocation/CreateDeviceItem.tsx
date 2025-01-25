import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { MapAppUsageStep, useMapAppState } from '../redux/MapAppState';
import { DeviceItemContainer } from './DeviceItemContainer';
import { CreateAccountOrLoginButton } from './CreateAccountOrLoginButton';
import { AddDeviceButton } from './AddDeviceButton';

export function CreateDeviceItem() {
    const { t } = useI18next();

    const mapAppState = useMapAppState();
    const isUserLoggedIn = mapAppState.usageStep === MapAppUsageStep.DEVICE_MANAGEMENT;

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            {isUserLoggedIn ? <AddDeviceButton /> : <CreateAccountOrLoginButton />}
        </DeviceItemContainer>
    );
}
