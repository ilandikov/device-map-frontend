import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useAppDispatch } from '../../../redux/store';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';
import { mapAppDeleteDeviceRequest } from './redux/MapAppAction';

export function DeviceListItem(props: { device: T22Device; validations: number; showDeleteButton: boolean }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <DeviceListItemWrapper validations={props.validations}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {props.showDeleteButton && (
                <button
                    className="device-list-item-opaque-text"
                    data-testid="deleteDeviceButton"
                    onClick={() => dispatch(mapAppDeleteDeviceRequest(props.device.id))}
                >
                    {t('deleteDevice')}
                </button>
            )}
        </DeviceListItemWrapper>
    );
}
