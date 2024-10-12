import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import terminals from '../../../assets/images/Terminals.png';
import { Device } from './redux/MapAppState';

export function DeviceListItem(props: { device: Device }) {
    const { t } = useI18next();

    return (
        <div className="device-list-item-container">
            <div className="device-list-item-shadow device-list-item-shadow-left device-list-item-shadow-left-first"></div>
            <div className="device-list-item-shadow device-list-item-shadow-right device-list-item-shadow-right-first"></div>
            <img src={terminals} className="device-list-item-image" alt="device-list-item-image" />
            <div className="device-list-item">
                <p>{props.device.name}</p>
                <button>{t('deviceReportBroken')}</button>
            </div>
        </div>
    );
}
