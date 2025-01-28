import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { mapAppListDevicesRequest } from '../redux/AppleSauceActions';

export function AddDeviceButton() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <button data-testid="createDeviceButton" onClick={() => dispatch(mapAppListDevicesRequest())}>
            {t('deviceAddDevice')}
        </button>
    );
}
