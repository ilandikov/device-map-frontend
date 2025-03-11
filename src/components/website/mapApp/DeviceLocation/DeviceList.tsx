import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useMapAppState } from '../redux/MapAppState';
import { DeviceItem } from './DeviceItem';
import { CreateDeviceItem } from './CreateDeviceItem';
import './DeviceList.scss';
import { DeviceItemWaitingCreation } from './DeviceItemWaitingCreation';
import { CreateDeviceButton } from './CreateDeviceButton';
import { CreateAccountOrLoginButton } from './CreateAccountOrLoginButton';
import { DeviceItemContainer } from './DeviceItemContainer';

export function DeviceList() {
    const { t } = useI18next();
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
            {loggedInUser ? (
                <CreateDeviceItem key={uniqueKeyForCreateDeviceItem} />
            ) : (
                <DeviceItemContainer deviceItemType={'create'}>
                    <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
                    {loggedInUser ? <CreateDeviceButton /> : <CreateAccountOrLoginButton />}
                </DeviceItemContainer>
            )}
        </div>
    );
}
