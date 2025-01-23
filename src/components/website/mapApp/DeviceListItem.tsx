import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { DeviceListItemContainer, getDeviceItemType } from './DeviceListItemContainer';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';

export function DeviceListItem(props: { device: T22Device; createdByCurrentUser: boolean }) {
    const { t } = useI18next();

    const canBeDeleted = props.createdByCurrentUser;

    const deviceApprovals = props.device.approvals ?? 0;
    const deviceStatus = getDeviceItemType(deviceApprovals);
    const canReceiveApprovals = deviceStatus === 'created' || deviceStatus === 'approving';
    const userLoggedIn = useMapAppState().usageStep === MapAppUsageStep.DEVICE_MANAGEMENT;
    const canBeApproved = canReceiveApprovals && userLoggedIn && !props.createdByCurrentUser;

    return (
        <DeviceListItemContainer deviceApprovalStatus={deviceStatus}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {canBeDeleted && <DeleteButton id={props.device.id} />}
            {canBeApproved && <ApproveButton id={props.device.id} />}
        </DeviceListItemContainer>
    );
}
