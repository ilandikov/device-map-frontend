import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useEffect } from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useMapAppState } from '../redux/MapAppState';
import { setAuthenticatedClient } from '../../../../client/graphql';
import { onDeviceCreationSubscription } from '../../../../client/query';
import { useAppDispatch } from '../../../../redux/store';
import { DeviceItemContainer } from './DeviceItemContainer';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';
import { getDeviceItemType } from './DeviceItemType';

export function DeviceItem(props: { device: T22Device }) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const { device } = props;

    const { loggedInUser } = useMapAppState();

    const isDeviceCreatedByCurrentUser = device.creatorID === loggedInUser?.id;
    const canBeDeleted = isDeviceCreatedByCurrentUser;
    const deviceItemType = getDeviceItemType(device.approvals ?? 0);
    const canReceiveApprovals = deviceItemType === 'created' || deviceItemType === 'approving';
    const canBeApproved = canReceiveApprovals && loggedInUser && !isDeviceCreatedByCurrentUser;

    useEffect(() => {
        dispatch(subscribeToDeviceUpdates(device.id));
    }, []);
    return (
        <DeviceItemContainer deviceItemType={deviceItemType}>
            <p>{device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {canBeDeleted && <DeleteButton id={device.id} />}
            {canBeApproved && <ApproveButton id={device.id} />}
        </DeviceItemContainer>
    );
}

function subscribeToDeviceUpdates(id) {
    return async (_dispatch) => {
        console.log('THUNK: creating observable');
        console.log('THUNK: trying to subscribe with id', id);
        (await setAuthenticatedClient())
            .subscribe({ query: onDeviceCreationSubscription, variables: { id } })
            .subscribe({
                next: (fetchResult) => {
                    console.log('THUNK: got a result');
                    console.log(fetchResult);
                },
                error: (error) => {
                    console.log('THUNK: got an error');
                    console.log(error);
                },
            });
    };
}
