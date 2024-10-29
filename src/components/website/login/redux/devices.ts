import { Observable, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { ApolloQueryResult } from '@apollo/client';
import { MapAppActionType, mapAppRemoteAnswer } from '../../mapApp/redux/MapAppAction';
import { Device } from '../../mapApp/redux/MapAppState';
import { AllActions, RootEpic } from '../../../../redux/store';
import { listDevicesQuery } from './devicesHelpers';

export function listDevices(loader: () => Promise<ApolloQueryResult<any>>, action$: Observable<AllActions>) {
    const queryDevices = () => fromPromise(loader()).pipe(mergeMap(processAnswer));

    return action$.pipe(ofType(MapAppActionType.REMOTE_REQUEST), switchMap(queryDevices));
}

export const devices: RootEpic = (action$, _, { apolloClient }) => {
    return listDevices(() => apolloClient.query(listDevicesQuery), action$);
};

// need to test this
export function deviceTransformer(device: T22ListDevice): Device {
    return {
        id: device.id,
        location: {
            lat: device.location.lat,
            lng: device.location.lon, // TODO rename lng -> lon in local state
        },
    };
}

// test this in integration
export const processAnswer = (response: Response) => {
    return of(mapAppRemoteAnswer(response.data.T22ListDevices.map(deviceTransformer)));
};

interface T22ListDevice {
    __typename: string;
    location: { __typename: string; lon: number; lat: number };
    id: string;
}

interface Response {
    data: {
        T22ListDevices: T22ListDevice[];
    };
}
