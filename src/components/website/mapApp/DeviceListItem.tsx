import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { DeviceListItemContainer, getDeviceApprovalStatus } from './DeviceListItemContainer';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';
import { MapAppUsageStep, T22DeviceTemp, useMapAppState } from './redux/MapAppState';

export function DeviceListItem(props: { device: T22DeviceTemp; createdByCurrentUser: boolean }) {
    const { t } = useI18next();

    const canBeDeleted = props.createdByCurrentUser;

    const deviceApprovals = props.device.approvals ?? 0;
    const canReceiveApprovals =
        getDeviceApprovalStatus(deviceApprovals) === 'created' ||
        getDeviceApprovalStatus(deviceApprovals) === 'approving';
    const userLoggedIn = useMapAppState().usageStep === MapAppUsageStep.DEVICE_MANAGEMENT;
    const canBeApproved = canReceiveApprovals && userLoggedIn && !props.createdByCurrentUser;

    return (
        <DeviceListItemContainer approvals={deviceApprovals}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {canBeDeleted && <DeleteButton id={props.device.id} />}
            {canBeApproved && <ApproveButton id={props.device.id} />}
        </DeviceListItemContainer>
    );
}
