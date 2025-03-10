import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { deviceCreateRequest, deviceCreationSubscriptionRequest } from '../redux/DeviceAction';

export function CreateDeviceButton() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <button
            data-testid="createDeviceButton"
            onClick={() => {
                dispatch(deviceCreateRequest());
                dispatch(deviceCreationSubscriptionRequest());
            }}
        >
            {t('deviceAddDevice')}
        </button>
    );
}
