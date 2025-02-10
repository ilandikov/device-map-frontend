import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useMapAppState } from '../redux/MapAppState';
import { DeviceItemContainer } from './DeviceItemContainer';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';
import { getDeviceItemType } from './DeviceItemType';

export function DeviceItem(props: { device: T22Device; isDeviceCreatedByCurrentUser: boolean }) {
    const { t } = useI18next();

    const { device, isDeviceCreatedByCurrentUser } = props;

    const canBeDeleted = isDeviceCreatedByCurrentUser;
    const deviceItemType = getDeviceItemType(device.approvals ?? 0);
    const canReceiveApprovals = deviceItemType === 'created' || deviceItemType === 'approving';
    const isUserLoggedIn = useMapAppState().currentUserID !== null;
    const canBeApproved = canReceiveApprovals && isUserLoggedIn && !isDeviceCreatedByCurrentUser;

    return (
        <DeviceItemContainer deviceItemType={deviceItemType}>
            <p>{device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {canBeDeleted && <DeleteButton id={device.id} />}
            {canBeApproved && <ApproveButton id={device.id} />}
        </DeviceItemContainer>
    );
}
