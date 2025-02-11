import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { mapAppResetCurrentUser } from '../redux/MapAppAction';

export function CreateAccountOrLoginButton() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <button data-testid="deviceCreateAccountOrLogin" onClick={() => dispatch(mapAppResetCurrentUser())}>
            {t('deviceCreateAccountOrLogin')}
        </button>
    );
}
