import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { DeviceItemContainer } from './DeviceItemContainer';

export function DeviceItemWaitingCreation(props: { device: T22Device }) {
    const { t } = useI18next();

    const { device } = props;

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p>{device.id}</p>
            <p>{t('deviceWaitingForCreation')}</p>
        </DeviceItemContainer>
    );
}
