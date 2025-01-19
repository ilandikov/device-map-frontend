import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useAppDispatch } from '../../../redux/store';
import { DeviceListItemWrapper, getDeviceApprovalStatus } from './DeviceListItemWrapper';
import { DeleteButton } from './DeleteButton';
import { mapAppApproveDeviceRequest } from './redux/MapAppAction';

function ApproveButton(props: { id: string }) {
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

export function DeviceListItem(props: { device: T22Device; approvals: number; createdByCurrentUser: boolean }) {
    const { t } = useI18next();

    const canDeviceBeApproved =
        getDeviceApprovalStatus(props.approvals) === 'created' ||
        getDeviceApprovalStatus(props.approvals) === 'approving';

    return (
        <DeviceListItemWrapper approvals={props.approvals}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {props.createdByCurrentUser && <DeleteButton id={props.device.id} />}
            {!props.createdByCurrentUser && canDeviceBeApproved && <ApproveButton id={props.device.id} />}
        </DeviceListItemWrapper>
    );
}
