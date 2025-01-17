import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useAppDispatch } from '../../../redux/store';
import { AuthenticationStep, useLoginModalAuthentication } from '../login/redux/AuthenticationState';
import { DeviceListItemWrapper } from './DeviceListItemWrapper';
import { mapAppDeleteDeviceRequest } from './redux/MapAppAction';

export function DeviceListItem(props: { device: T22Device; colorIndex: number; currentUserId: string }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const authenticationState = useLoginModalAuthentication();
    const userIsLoggedIn = authenticationState.step === AuthenticationStep.LOGGED_IN;
    const userCreatedThisDevice = props.currentUserId === props.device.id;
    const showDeleteButton = userIsLoggedIn && userCreatedThisDevice;

    return (
        <DeviceListItemWrapper colorIndex={props.colorIndex}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {showDeleteButton && (
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
