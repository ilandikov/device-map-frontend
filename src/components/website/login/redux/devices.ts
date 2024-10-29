import { EMPTY, catchError, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { ApolloQueryResult } from '@apollo/client';
import { MapAppActionType, MapAppRemoteRequestType, mapAppRemoteAnswer } from '../../mapApp/redux/MapAppAction';
import { Device } from '../../mapApp/redux/MapAppState';
import { RootEpic } from '../../../../redux/store';
import { T22Device, T22ListDevicesResponse } from './devicesHelpers';

export const devices: RootEpic = (action$, _, { apolloClient }) =>
    action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        switchMap((action) => {
            switch (action.request) {
                case MapAppRemoteRequestType.LIST_DEVICES:
                    return processListDevicesRequest(apolloClient.listDevices());
                default:
                    return EMPTY;
            }
        }),
    );

export function processListDevicesRequest(response: Promise<ApolloQueryResult<T22ListDevicesResponse>>) {
    const deviceTransformer = (device: T22Device): Device => ({
        id: device.id,
        location: {
            lat: device.location.lat,
            lng: device.location.lon, // TODO rename lng -> lon in local state
        },
    });

    const listDevicesResponse = (response: ApolloQueryResult<T22ListDevicesResponse>) =>
        of(mapAppRemoteAnswer(response.data.T22ListDevices.map(deviceTransformer)));

    const doNothing = () => EMPTY;

    return fromPromise(response).pipe(mergeMap(listDevicesResponse), catchError(doNothing));
}
