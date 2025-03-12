import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { DeviceItemContainer } from './DeviceItemContainer';

export function DeviceItemWaitingCreation(_props: { device: T22Device }) {
    const { t } = useI18next();

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p>{t('deviceWaitingForCreation')}</p>
        </DeviceItemContainer>
    );
}
