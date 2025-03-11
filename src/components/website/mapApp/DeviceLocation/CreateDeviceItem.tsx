import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { DeviceItemContainer } from './DeviceItemContainer';
import { CreateDeviceButton } from './CreateDeviceButton';

export function CreateDeviceItem() {
    const { t } = useI18next();

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <CreateDeviceButton />
        </DeviceItemContainer>
    );
}
