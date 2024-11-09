import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';

export function CreateDeviceItem() {
    const { t } = useI18next();

    return (
        <DeviceListItemWrapper colorIndex={null}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <button data-testid="createDeviceButton">{t('deviceAddDevice')}</button>
        </DeviceListItemWrapper>
    );
}
