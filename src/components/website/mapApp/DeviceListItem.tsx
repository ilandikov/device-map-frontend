import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useAppDispatch } from '../../../redux/store';
import { DeviceListItemWrapper, getDeviceApprovalStatus } from './DeviceListItemWrapper';
import { mapAppDeleteDeviceRequest } from './redux/MapAppAction';

export function DeviceListItem(props: { device: T22Device; approvals: number; createdByCurrentUser: boolean }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <DeviceListItemWrapper approvals={props.approvals}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {props.createdByCurrentUser && (
                <button
                    className="device-list-item-opaque-text"
                    data-testid="deleteDeviceButton"
                    onClick={() => dispatch(mapAppDeleteDeviceRequest(props.device.id))}
                >
                    {t('deleteDevice')}
                </button>
            )}
            {!props.createdByCurrentUser &&
                (getDeviceApprovalStatus(props.approvals) === 'created' ||
                    getDeviceApprovalStatus(props.approvals) === 'approving') && (
                    <button className="device-list-item-opaque-text" data-testid="approveDeviceButton">
                        {t('approveDevice')}
                    </button>
                )}
        </DeviceListItemWrapper>
    );
}
