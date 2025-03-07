import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useEffect, useState } from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { useMapAppState } from '../redux/MapAppState';
import { setAnonymousClient } from '../../../../client/graphql';
import { onDeviceCreationSubscription } from '../../../../client/query';
import { DeviceItemContainer } from './DeviceItemContainer';
import { DeleteButton } from './DeleteButton';
import { ApproveButton } from './ApproveButton';
import { getDeviceItemType } from './DeviceItemType';

export function DeviceItem(props: { device: T22Device }) {
    const { t } = useI18next();

    const { device } = props;

    const { loggedInUser } = useMapAppState();

    const isDeviceCreatedByCurrentUser = device.creatorID === loggedInUser?.id;
    const canBeDeleted = isDeviceCreatedByCurrentUser;
    const deviceItemType = getDeviceItemType(device.approvals ?? 0);
    const canReceiveApprovals = deviceItemType === 'created' || deviceItemType === 'approving';
    const canBeApproved = canReceiveApprovals && loggedInUser && !isDeviceCreatedByCurrentUser;

    useSubscriptionToDeviceCreation(device.id);

    return (
        <DeviceItemContainer deviceItemType={deviceItemType}>
            <p>{device.id}</p>
            <button className="device-list-item-opaque-text">{t('deviceReportBroken')}</button>
            {canBeDeleted && <DeleteButton id={device.id} />}
            {canBeApproved && <ApproveButton id={device.id} />}
        </DeviceItemContainer>
    );
}

export function useSubscriptionToDeviceCreation(id: string) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const client = setAnonymousClient();
    let subscription: any;

    useEffect(() => {
        console.log('HOOK: use effect for id', id);
        client
            .then((client) => {
                console.log('HOOK: creating observer');
                const observer = client.subscribe({
                    query: onDeviceCreationSubscription,
                    variables: { id },
                });

                console.log('HOOK: subscribing to observer');
                subscription = observer.subscribe({
                    next: (data: any) => {
                        console.log('HOOK: received data', data);
                        setData(data);
                    },
                    error: (error: Error) => {
                        console.log('HOOK: received error', error);
                        setError(error);
                    },
                });
            })
            .catch((error) => {
                console.log('HOOK: could not subscribe', error);
                setError(error);
            });

        return () => {
            subscription?.unsubscribe();
        };
    }, [id]);

    return { data, error };
}
