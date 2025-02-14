import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { deviceCreateRequest } from '../redux/DeviceAction';

export function AddDeviceButton() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <button data-testid="createDeviceButton" onClick={() => dispatch(deviceCreateRequest())}>
            {t('deviceAddDevice')}
        </button>
    );
}
