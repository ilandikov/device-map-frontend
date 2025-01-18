import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';
import { MapAppRemoteRequestType, mapAppRemoteRequest } from './redux/MapAppAction';

export function CreateDeviceItem() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <DeviceListItemWrapper validations={-1}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <button
                data-testid="createDeviceButton"
                onClick={() => dispatch(mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE))}
            >
                {t('deviceAddDevice')}
            </button>
        </DeviceListItemWrapper>
    );
}
