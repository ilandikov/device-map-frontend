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
    switch (index % 3) {
        case 0:
            return {
                leftShadowColorClass: 'device-list-item-shadow-left-first',
                rightShadowColorClass: 'device-list-item-shadow-right-first',
            };
        case 1:
            return {
                leftShadowColorClass: 'device-list-item-shadow-left-second',
                rightShadowColorClass: 'device-list-item-shadow-right-second',
            };
        case 2:
            return {
                leftShadowColorClass: 'device-list-item-shadow-left-third',
                rightShadowColorClass: 'device-list-item-shadow-right-third',
            };
        default:
            console.warn('DeviceListItem component: index mod 3 has been more than 4. Colors may be wrong.');
            return {
                leftShadowColorClass: 'device-list-item-shadow-left-first',
                rightShadowColorClass: 'device-list-item-shadow-right-first',
            };
    }
}
