import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../../redux/store';

import { mapAppApproveDeviceRequest } from '../redux/AppleSauceActions';

export function ApproveButton(props: { id: string }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <button
            className="device-list-item-opaque-text"
            data-testid="approveDeviceButton"
            onClick={() => dispatch(mapAppApproveDeviceRequest(props.id))}
        >
            {t('approveDevice')}
        </button>
    );
}
