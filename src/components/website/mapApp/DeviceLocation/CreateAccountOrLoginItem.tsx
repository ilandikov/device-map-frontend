import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { mapAppResetCurrentUser } from '../redux/MapAppAction';
import { DeviceItemContainer } from './DeviceItemContainer';

export function CreateAccountOrLoginItem() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            {
                // TODO fix the dispatched action
            }
            <button data-testid="createAccountOrLoginButton" onClick={() => dispatch(mapAppResetCurrentUser())}>
                {t('deviceCreateAccountOrLogin')}
            </button>
        </DeviceItemContainer>
    );
}
