import { EMPTY, Observable, catchError, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import {
    MapAppAction,
    MapAppActionType,
    MapAppRemoteRequestType,
    mapAppAddDevice,
    mapAppRemoteErrorAnswer,
    mapAppSetDevices,
} from '../../mapApp/redux/MapAppAction';
import { DevicesClient, RootEpic } from '../../../../redux/store';
import { MapAppState } from '../../mapApp/redux/MapAppState';

export const devices: RootEpic = (action$, $state, { devicesClient }) =>
    action$.pipe(
        ofType(MapAppActionType.MAP_APP_REMOTE_REQUEST),
        switchMap((action) => {
            const devicesRequest = devicesRequests[action.request];
            if (!devicesRequest) {
                return EMPTY;
            }

            return fromPromise(devicesRequest.clientCall(devicesClient, $state.value.mapAppState)).pipe(
                mergeMap(devicesRequest.responseToAction),
                catchError((error) => of(mapAppRemoteErrorAnswer(error))),
            );
        }),
    );

type DevicesRequest<TResponse> = {
    clientCall: (client: DevicesClient, state: MapAppState) => Promise<TResponse>;
    responseToAction: (response: TResponse) => Observable<MapAppAction>;
};

const listDevicesRequest: DevicesRequest<T22Device[]> = {
    clientCall: (client, _) => client.forAnonymousUser.listDevices(),
    responseToAction: (response) => of(mapAppSetDevices(response)),
};

const createDeviceRequest: DevicesRequest<T22Device> = {
    clientCall: (client, state) => client.forAuthenticatedUser.createDevice(state.selectedMarker.location),
    responseToAction: (response) => of(mapAppAddDevice(response)),
};

const devicesRequests: { [key in MapAppRemoteRequestType]: DevicesRequest<any> } = {
    LIST_DEVICES: listDevicesRequest,
    CREATE_DEVICE: createDeviceRequest,
};
