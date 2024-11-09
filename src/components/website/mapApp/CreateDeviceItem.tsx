import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';

export function CreateDeviceItem() {
    const { t } = useI18next();

    return (
        <DeviceListItemWrapper index={null}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <button>{t('deviceAddDevice')}</button>
        </DeviceListItemWrapper>
    );
}
