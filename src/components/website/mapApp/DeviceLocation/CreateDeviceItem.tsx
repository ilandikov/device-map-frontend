import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { MapAppButton, MapAppRemoteRequestType, mapAppButtonClick, mapAppRemoteRequest } from '../redux/MapAppAction';
import { MapAppUsageStep, useMapAppState } from '../redux/MapAppState';
import { DeviceItemContainer } from './DeviceItemContainer';

export function CreateDeviceItem() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const mapAppState = useMapAppState();
    const isUserLoggedIn = mapAppState.usageStep === MapAppUsageStep.DEVICE_MANAGEMENT;

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            {isUserLoggedIn ? (
                <button
                    data-testid="createDeviceButton"
                    onClick={() => dispatch(mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE))}
                >
                    {t('deviceAddDevice')}
                </button>
            ) : (
                <button
                    data-testid="deviceCreateAccountOrLogin"
                    onClick={() => dispatch(mapAppButtonClick(MapAppButton.LOGIN))}
                >
                    {t('deviceCreateAccountOrLogin')}
                </button>
            )}
        </DeviceItemContainer>
    );
}
