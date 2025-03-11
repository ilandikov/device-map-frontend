import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useMapAppState } from '../redux/MapAppState';
import { DeviceItem } from './DeviceItem';
import { CreateDeviceItem } from './CreateDeviceItem';
import './DeviceList.scss';
import { DeviceItemWaitingCreation } from './DeviceItemWaitingCreation';
import { DeviceItemContainer } from './DeviceItemContainer';
import { CreateAccountOrLoginButton } from './CreateAccountOrLoginButton';

export function CreateAccountOrLoginButton2() {
    const { t } = useI18next();
    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <CreateAccountOrLoginButton />
        </DeviceItemContainer>
    );
}

export function DeviceList() {
    const { selectedMarker, devices, loggedInUser } = useMapAppState();

    const devicesAtSelectedMarkerLocation = devices
        .filter(
            (device) =>
                device.location.lat === selectedMarker.location.lat &&
                device.location.lon === selectedMarker.location.lon,
        )
        .map((device, index) =>
            device.approvals >= 0 ? (
                <DeviceItem device={device} key={index} />
            ) : (
                <DeviceItemWaitingCreation device={device} key={index} />
            ),
        );

    const uniqueKeyForCreateDeviceItem = devicesAtSelectedMarkerLocation.length + 1;

    return (
        <div className="device-list-container">
            {devicesAtSelectedMarkerLocation}
            {loggedInUser ? <CreateDeviceItem key={uniqueKeyForCreateDeviceItem} /> : <CreateAccountOrLoginButton2 />}
        </div>
    );
}
