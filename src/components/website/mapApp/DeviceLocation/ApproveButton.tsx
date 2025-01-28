import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';

import { deviceApproveRequest } from '../redux/MapAppRemoteActions';

export function ApproveButton(props: { id: string }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <button
            className="device-list-item-opaque-text"
            data-testid="approveDeviceButton"
            onClick={() => dispatch(deviceApproveRequest(props.id))}
        >
            {t('approveDevice')}
        </button>
    );
}
