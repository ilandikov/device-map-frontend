import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { deviceCreateRequest, deviceCreation, deviceCreationSubscriptionRequest } from '../redux/DeviceAction';
import { useAppDispatch } from '../../../../redux/store';
import { DeviceItemContainer } from './DeviceItemContainer';

export function CreateDeviceItem() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <button
                data-testid="createDeviceButton"
                onClick={() => {
                    dispatch(deviceCreateRequest());
                    dispatch(deviceCreationSubscriptionRequest());
                    dispatch(deviceCreation(true));
                }}
            >
                {t('deviceAddDevice')}
            </button>
        </DeviceItemContainer>
    );
}
