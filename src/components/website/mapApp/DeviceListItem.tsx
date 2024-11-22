import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useAppDispatch } from '../../../redux/store';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';
import { mapAppDeleteDevice } from './redux/MapAppAction';

export function DeviceListItem(props: { device: T22Device; colorIndex: number }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <DeviceListItemWrapper colorIndex={props.colorIndex}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            <button
                className="device-list-item-opaque-text"
                data-testid="deleteDeviceButton"
                onClick={() => dispatch(mapAppDeleteDevice(props.device.id))}
            >
                {t('deleteDevice')}
            </button>
        </DeviceListItemWrapper>
    );
}
