import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { useAuthentication } from '../login/redux/state';
import { LoginModalVerifyTypes, loginModalButtonClick, loginModalVerifyRequest } from '../login/redux/actions';
import { mapAppLoginButtonClick, mapAppLogoutButtonClick } from './redux/actions';
import Account from '/src/assets/images/Account.svg';

function UserButton(props: { caption: string; onClick: () => void }) {
    return (
        <button className="map-app-header-user-button" data-testid="userButton" onClick={props.onClick}>
            <img className="map-app-header-account-image" src={Account} alt="login-header-account" />
            <p className="map-app-header-account-text">{props.caption}</p>
        </button>
    );
}

export function LogoutButton() {
    const useDispatch = useAppDispatch();
    const { email } = useAuthentication();

    return (
        <UserButton
            caption={email}
            onClick={() => {
                useDispatch(mapAppLogoutButtonClick());
                useDispatch(loginModalButtonClick('userButton'));
                useDispatch(loginModalVerifyRequest(LoginModalVerifyTypes.SIGN_OUT));
            }}
        />
    );
}

export function LoginButton() {
    const { t } = useI18next();
    const useDispatch = useAppDispatch();

    return (
        <UserButton
            caption={t('loginAction')}
            onClick={() => {
                useDispatch(mapAppLoginButtonClick());
            }}
        />
    );
}
