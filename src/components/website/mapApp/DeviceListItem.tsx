import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useAppDispatch } from '../../../redux/store';
import { AuthenticationStep, useLoginModalAuthentication } from '../login/redux/AuthenticationState';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';
import { mapAppDeleteDeviceRequest } from './redux/MapAppAction';

export function DeviceListItem(props: { device: T22Device; colorIndex: number }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const authenticationState = useLoginModalAuthentication();
    const userIsLoggedIn = authenticationState.step === AuthenticationStep.LOGGED_IN;
    const userCreatedThisDevice = authenticationState.id === props.device.id;

    return (
        <DeviceListItemWrapper colorIndex={props.colorIndex}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {userIsLoggedIn && userCreatedThisDevice && (
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
