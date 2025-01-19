import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { DeviceListItemContainer, getDeviceApprovalStatus } from './DeviceListItemContainer';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';

export function DeviceListItem(props: { device: T22Device; approvals: number; createdByCurrentUser: boolean }) {
    const { t } = useI18next();

    const canDeviceBeDeleted = props.createdByCurrentUser;

    const canDeviceBeApproved =
        getDeviceApprovalStatus(props.approvals) === 'created' ||
        getDeviceApprovalStatus(props.approvals) === 'approving';

    return (
        <DeviceListItemContainer approvals={props.approvals}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {canDeviceBeDeleted && <DeleteButton id={props.device.id} />}
            {!props.createdByCurrentUser && canDeviceBeApproved && <ApproveButton id={props.device.id} />}
        </DeviceListItemContainer>
    );
}
