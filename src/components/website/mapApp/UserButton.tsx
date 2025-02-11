import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { useLoginModalAuthentication } from '../login/redux/AuthenticationState';
import {
    LoginModalButton,
    LoginModalCheck,
    loginModalButtonClick,
    loginModalRemoteRequest,
} from '../login/redux/LoginModalAction';
import { mapAppResetCurrentUser, mapAppSetUsageStep } from './redux/MapAppAction';
import Account from '/src/assets/images/Account.svg';
import { MapAppComponents } from './redux/MapAppState';

function UserButton(props: { caption: string; onClick: () => void }) {
    return (
        <button className="map-app-header-user-button" data-testid="userButton" onClick={props.onClick}>
            <img className="map-app-header-account-image" src={Account} alt="login-header-account" />
            <p className="map-app-header-account-text">{props.caption}</p>
        </button>
    );
}

export function LogoutButton() {
    const dispatch = useAppDispatch();
    const { email } = useLoginModalAuthentication();

    return (
        <UserButton
            caption={email}
            onClick={() => {
                dispatch(mapAppSetUsageStep(MapAppComponents.HOME_SCREEN));
                dispatch(mapAppResetCurrentUser());
                dispatch(loginModalButtonClick(LoginModalButton.USER_BUTTON));
                dispatch(loginModalRemoteRequest(LoginModalCheck.NONE));
            }}
        />
    );
}

export function LoginButton() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <UserButton
            caption={t('loginAction')}
            onClick={() => {
                dispatch(mapAppSetUsageStep(MapAppComponents.USER_AUTHENTICATION));
            }}
        />
    );
}
