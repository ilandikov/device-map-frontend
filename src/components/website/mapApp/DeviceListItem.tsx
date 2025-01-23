import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { DeviceItemContainer } from './DeviceItemContainer';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';
import { getDeviceItemType } from './DeviceItemType';

export function DeviceListItem(props: { device: T22Device; createdByCurrentUser: boolean }) {
    const { t } = useI18next();

    const canBeDeleted = props.createdByCurrentUser;

    const deviceApprovals = props.device.approvals ?? 0;
    const deviceItemType = getDeviceItemType(deviceApprovals);
    const canReceiveApprovals = deviceItemType === 'created' || deviceItemType === 'approving';
    const userLoggedIn = useMapAppState().usageStep === MapAppUsageStep.DEVICE_MANAGEMENT;
    const canBeApproved = canReceiveApprovals && userLoggedIn && !props.createdByCurrentUser;

    return (
        <DeviceItemContainer deviceItemType={deviceItemType}>
            <p>{props.device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {canBeDeleted && <DeleteButton id={props.device.id} />}
            {canBeApproved && <ApproveButton id={props.device.id} />}
        </DeviceItemContainer>
    );
}
