import { mergeMap, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { ApolloQueryResult } from '@apollo/client';
import { MapAppActionType, mapAppRemoteAnswer } from '../../mapApp/redux/MapAppAction';
import { Device } from '../../mapApp/redux/MapAppState';
import { RootEpic } from '../../../../redux/store';
import { T22Device, T22ListDevicesResponse, listDevicesQuery } from './devicesHelpers';

export const devices: RootEpic = (action$, _, { apolloClient }) =>
    action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        mergeMap(() => {
            return listDevices(apolloClient.query(listDevicesQuery));
        }),
    );

export function listDevices(deviceListPromise: Promise<ApolloQueryResult<T22ListDevicesResponse>>) {
    const processAnswer = (response: ApolloQueryResult<T22ListDevicesResponse>) =>
        of(mapAppRemoteAnswer(response.data.T22ListDevices.map(deviceTransformer)));

    return fromPromise(deviceListPromise).pipe(mergeMap(processAnswer));
}

export function deviceTransformer(device: T22Device): Device {
    return {
        id: device.id,
        location: {
            lat: device.location.lat,
            lng: device.location.lon, // TODO rename lng -> lon in local state
        },
    };
}
