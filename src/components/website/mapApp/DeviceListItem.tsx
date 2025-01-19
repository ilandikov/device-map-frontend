import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { DeviceListItemContainer, getDeviceApprovalStatus } from './DeviceListItemContainer';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';

export function DeviceListItem(props: { device: T22Device; approvals: number; createdByCurrentUser: boolean }) {
    const { t } = useI18next();

    const canBeDeleted = props.createdByCurrentUser;

    const canReceiveApprovals =
        getDeviceApprovalStatus(props.approvals) === 'created' ||
        getDeviceApprovalStatus(props.approvals) === 'approving';
    const canBeApproved = !props.createdByCurrentUser && canReceiveApprovals;

    return (
        <DeviceListItemContainer approvals={props.approvals}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {canBeDeleted && <DeleteButton id={props.device.id} />}
            {canBeApproved && <ApproveButton id={props.device.id} />}
        </DeviceListItemContainer>
    );
}
