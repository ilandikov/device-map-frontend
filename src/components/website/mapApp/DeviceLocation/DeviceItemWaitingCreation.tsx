import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useMapAppState } from '../redux/MapAppState';
import { getDeviceItemType } from './DeviceItemType';
import { DeviceItemContainer } from './DeviceItemContainer';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';

export function DeviceItemWaitingCreation(props: { device: T22Device }) {
    const { t } = useI18next();

    const { device } = props;

    const { loggedInUser } = useMapAppState();

    const isDeviceCreatedByCurrentUser = device.creatorID === loggedInUser?.id;
    const canBeDeleted = isDeviceCreatedByCurrentUser;
    const deviceItemType = getDeviceItemType(device.approvals ?? 0);
    const canReceiveApprovals = deviceItemType === 'created' || deviceItemType === 'approving';
    const canBeApproved = canReceiveApprovals && loggedInUser && !isDeviceCreatedByCurrentUser;

    return (
        <DeviceItemContainer deviceItemType={deviceItemType}>
            <p>{device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {canBeDeleted && <DeleteButton id={device.id} />}
            {canBeApproved && <ApproveButton id={device.id} />}
        </DeviceItemContainer>
    );
}
