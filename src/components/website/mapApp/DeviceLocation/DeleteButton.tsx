import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';

import { mapAppDeleteDeviceRequest } from '../redux/MapAppRemoteActions';

export function DeleteButton(props: { id: string }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <button
            className="device-list-item-opaque-text"
            data-testid="deleteDeviceButton"
            onClick={() => dispatch(mapAppDeleteDeviceRequest(props.id))}
        >
            {t('deleteDevice')}
        </button>
    );
}
