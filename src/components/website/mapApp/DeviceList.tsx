import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useMapAppState } from './redux/MapAppState';
import { DeviceListItem, getColorClassesForDeviceItemShadows } from './DeviceListItem';
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
            <DeviceListItem index={index} key={index} colorClassesForItemShadows={getColorClassesForDeviceItemShadows}>
                <p>{device.id}</p>
                <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            </DeviceListItem>
        ));

    devicesAtSelectedMarkerLocation.push(
        <DeviceListItem index={null} colorClassesForItemShadows={getColorClassesForDeviceItemShadows}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <button>{t('deviceAddDevice')}</button>
        </DeviceListItem>,
    );

    return <div className="device-list-container">{devicesAtSelectedMarkerLocation}</div>;
}
