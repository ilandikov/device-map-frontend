import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { getDeviceItemType } from './DeviceItemType';
import { DeviceItemContainer } from './DeviceItemContainer';

export function DeviceItemWaitingCreation(props: { device: T22Device }) {
    const { t } = useI18next();

    const { device } = props;
    const deviceItemType = getDeviceItemType(device.approvals ?? 0);

    return (
        <DeviceItemContainer deviceItemType={deviceItemType}>
            <p>{device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
        </DeviceItemContainer>
    );
}
