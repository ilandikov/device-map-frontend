import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { mapAppShowComponent } from '../redux/MapAppAction';
import { MapAppComponents } from '../redux/MapAppState';
import { DeviceItemContainer } from './DeviceItemContainer';

export function CreateAccountOrLoginItem() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <DeviceItemContainer deviceItemType={'create'}>
            <p className="device-list-item-opaque-text">{t('deviceNoDeviceHere')}</p>
            <button
                data-testid="createAccountOrLoginButton"
                onClick={() => dispatch(mapAppShowComponent(MapAppComponents.LOGIN_MODAL))}
            >
                {t('deviceCreateAccountOrLogin')}
            </button>
        </DeviceItemContainer>
    );
}
