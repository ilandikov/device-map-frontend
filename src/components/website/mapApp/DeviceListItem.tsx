import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useAppDispatch } from '../../../redux/store';
import { DeviceListItemWrapper, getDeviceApprovalStatus } from './DeviceListItemWrapper';
import { mapAppApproveDeviceRequest } from './redux/MapAppAction';
import { DeleteButton } from './DeleteButton';

export function DeviceListItem(props: { device: T22Device; approvals: number; createdByCurrentUser: boolean }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const canDeviceBeApproved =
        getDeviceApprovalStatus(props.approvals) === 'created' ||
        getDeviceApprovalStatus(props.approvals) === 'approving';

    return (
        <DeviceListItemWrapper approvals={props.approvals}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {props.createdByCurrentUser && <DeleteButton id={props.device.id} />}
            {!props.createdByCurrentUser && canDeviceBeApproved && (
                <button
                    className="device-list-item-opaque-text"
                    data-testid="approveDeviceButton"
                    onClick={() => dispatch(mapAppApproveDeviceRequest(props.device.id))}
                >
                    {t('approveDevice')}
                </button>
            )}
        </DeviceListItemWrapper>
    );
}
