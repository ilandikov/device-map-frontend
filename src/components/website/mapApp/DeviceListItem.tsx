import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';

export function DeviceListItem(props: { device: T22Device; colorIndex: number }) {
    const { t } = useI18next();

    return (
        <DeviceListItemWrapper colorIndex={props.colorIndex}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
        </DeviceListItemWrapper>
    );
}
