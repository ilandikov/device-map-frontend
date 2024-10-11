import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import terminals from '../../../assets/images/Terminals.png';
import { Device } from './redux/MapAppState';

export function DeviceListItem(device: Device) {
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
