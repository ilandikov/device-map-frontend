import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import home from '../../../assets/images/Home.png';
import terminals from '../../../assets/images/Terminals.png';
import { Device, useMapAppState } from './redux/MapAppState';
import './DeviceList.scss';

function DeviceListItem(device: Device) {
    const { t } = useI18next();

    return (
        <div className="devices-list-item-container">
            <div className="devices-list-item-shadow devices-list-item-shadow-left"></div>
            <div className="devices-list-item-shadow devices-list-item-shadow-right"></div>
            <img src={terminals} className="devices-list-item-image" alt="devices-list-item-image" />
            <div className="devices-list-item">
                <p>{device.name}</p>
                <button>{t('deviceReportBroken')}</button>
            </div>
        </div>
    );
}

export function DeviceList() {
    const mapAppState = useMapAppState();
    const devices = mapAppState.devices;
    const deviceListItems = devices
        .filter((device) => {
            return (
                device.location.lat === mapAppState.selectedMarkerLocation.lat &&
                device.location.lng === mapAppState.selectedMarkerLocation.lng
            );
        })
        .map((device) => {
            return DeviceListItem(device);
        });

    return (
        <div className="devices-list-window">
            <div className="devices-list-address-container">
                <img src={home} className="devices-list-address-image" alt="devices-list-address-image" />
                <div className="devices-address">
                    <p>Address1</p>
                    <span>Address2</span>
                </div>
            </div>
            <div className="devices-list-container">{deviceListItems}</div>
        </div>
    );
}
