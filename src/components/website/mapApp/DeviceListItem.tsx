import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { DeviceListItemWrapper, getDeviceApprovalStatus } from './DeviceListItemWrapper';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';

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
