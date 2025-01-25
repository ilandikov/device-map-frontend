import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { MapAppButton, mapAppButtonClick } from '../redux/MapAppAction';

export function CreateAccountOrLoginButton() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <button
            data-testid="deviceCreateAccountOrLogin"
            onClick={() => dispatch(mapAppButtonClick(MapAppButton.LOGIN))}
        >
            {t('deviceCreateAccountOrLogin')}
        </button>
    );
}
