import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';
import { Device } from './redux/MapAppState';

export function DeviceListItem(props: { device: Device; index: number }) {
    const { t } = useI18next();

    return (
        <DeviceListItemWrapper index={props.index}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
        </DeviceListItemWrapper>
    );
}
