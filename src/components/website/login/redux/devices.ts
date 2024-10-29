import { mergeMap, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { ApolloQueryResult } from '@apollo/client';
import { MapAppActionType, mapAppRemoteAnswer } from '../../mapApp/redux/MapAppAction';
import { Device } from '../../mapApp/redux/MapAppState';
import { RootEpic } from '../../../../redux/store';
import { T22Device, T22ListDevicesResponse } from './devicesHelpers';

export const devices: RootEpic = (action$, _, { devicesClient }) =>
    action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        mergeMap(() => {
            return listDevices(devicesClient.query());
        }),
    );

export function listDevices(deviceListPromise: Promise<ApolloQueryResult<T22ListDevicesResponse>>) {
    const deviceTransformer = (device: T22Device): Device => ({
        id: device.id,
        location: {
            lat: device.location.lat,
            lng: device.location.lon, // TODO rename lng -> lon in local state
        },
    });

    const processAnswer = (response: ApolloQueryResult<T22ListDevicesResponse>) =>
        of(mapAppRemoteAnswer(response.data.T22ListDevices.map(deviceTransformer)));

    return fromPromise(deviceListPromise).pipe(mergeMap(processAnswer));
}
