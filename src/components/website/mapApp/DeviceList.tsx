import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useMapAppState } from './redux/MapAppState';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';
import './DeviceList.scss';

export function DeviceList() {
    const { t } = useI18next();

    const mapAppState = useMapAppState();
    const selectedMarker = mapAppState.selectedMarker;

    const devicesAtSelectedMarkerLocation = mapAppState.devices
        .filter(
            (device) =>
                device.location.lat === selectedMarker.location.lat &&
                device.location.lon === selectedMarker.location.lon,
        )
        .map((device, index) => (
            <DeviceListItemWrapper index={index} key={index}>
                <p>{device.id}</p>
                <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            </DeviceListItemWrapper>
        ));

    devicesAtSelectedMarkerLocation.push(
        <DeviceListItemWrapper index={null}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <button>{t('deviceAddDevice')}</button>
        </DeviceListItemWrapper>,
    );

    return <div className="device-list-container">{devicesAtSelectedMarkerLocation}</div>;
}
