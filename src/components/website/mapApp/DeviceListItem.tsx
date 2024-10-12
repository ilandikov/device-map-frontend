import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import terminals from '../../../assets/images/Terminals.png';
import { Device } from './redux/MapAppState';

export function DeviceListItem(props: { device: Device; index: number }) {
    const { t } = useI18next();

    const { leftShadowColorClass, rightShadowColorClass } = getColorClassesForDeviceItemShadows(props.index);

    return (
        <div className="device-list-item-container">
            <div className={`device-list-item-shadow device-list-item-shadow-left ${leftShadowColorClass}`}></div>
            <div className={`device-list-item-shadow device-list-item-shadow-right ${rightShadowColorClass}`}></div>
            <img src={terminals} className="device-list-item-image" alt="device-list-item-image" />
            <div className="device-list-item">
                <p>{props.device.name}</p>
                <button>{t('deviceReportBroken')}</button>
            </div>
        </div>
    );
}

function getColorClassesForDeviceItemShadows(index: number) {
    return {
        leftShadowColorClass: 'device-list-item-shadow-left-first',
        rightShadowColorClass: 'device-list-item-shadow-right-first',
    };
}
