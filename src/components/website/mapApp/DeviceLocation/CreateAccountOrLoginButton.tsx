import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { mapAppResetCurrentUser } from '../redux/MapAppAction';
import { DeviceItemContainer } from './DeviceItemContainer';

export function CreateAccountOrLoginButton2() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <button data-testid="createAccountOrLoginButton" onClick={() => dispatch(mapAppResetCurrentUser())}>
                {t('deviceCreateAccountOrLogin')}
            </button>
        </DeviceItemContainer>
    );
}
