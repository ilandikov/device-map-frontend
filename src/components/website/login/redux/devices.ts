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

export const devices: RootEpic = (action$, $state, { devicesClient }) =>
    action$.pipe(
        ofType(MapAppActionType.MAP_APP_REMOTE_REQUEST),
        switchMap((action) => {
            if (devicesRequests[action.request]) {
                return processDevicesRequest(
                    devicesRequests[action.request].clientCall(devicesClient),
                    devicesRequests[action.request].responseToAction,
                );
            }
            switch (action.request) {
                case MapAppRemoteRequestType.CREATE_DEVICE:
                    return processDevicesRequest<T22Device>(
                        devicesClient.forAuthenticatedUser.createDevice(
                            $state.value.mapAppState.selectedMarker.location,
                        ),
                        (response) => of(mapAppAddDevice(response)),
                    );
                default:
                    return EMPTY;
            }
        }),
    );

function processDevicesRequest<TResponse>(
    response: Promise<TResponse>,
    responseToAction: (response: TResponse) => Observable<MapAppAction>,
) {
    return fromPromise(response).pipe(mergeMap(responseToAction), catchError(reportError));
}

const reportError = (error) => of(mapAppRemoteErrorAnswer(error));

type DevicesRequest<TResponse> = {
    clientCall: (client: DevicesClient) => Promise<TResponse>;
    responseToAction: (response: TResponse) => Observable<MapAppAction>;
};

const listDevicesRequest: DevicesRequest<T22Device[]> = {
    clientCall: (client) => client.forAnonymousUser.listDevices(),
    responseToAction: (response) => of(mapAppSetDevices(response)),
};

const devicesRequests: Partial<{ [key in MapAppRemoteRequestType]: DevicesRequest<T22Device[]> }> = {
    LIST_DEVICES: listDevicesRequest,
};
