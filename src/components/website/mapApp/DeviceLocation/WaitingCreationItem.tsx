import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { DeviceItemContainer } from './DeviceItemContainer';

export function WaitingCreationItem() {
    const { t } = useI18next();

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p>{t('deviceWaitingForCreation')}</p>
        </DeviceItemContainer>
    );
}
