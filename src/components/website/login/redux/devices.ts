import { EMPTY, Observable, catchError, from, mergeMap, of, switchMap } from 'rxjs';
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
import { RootEpic } from '../../../../redux/store';

export const devices: RootEpic = (action$, $state, { devicesClient }) =>
    action$.pipe(
        ofType(MapAppActionType.MAP_APP_REMOTE_REQUEST),
        switchMap((action) => {
            switch (action.request) {
                case MapAppRemoteRequestType.LIST_DEVICES:
                    return processListDevicesRequest(
                        devicesClient.forAnonymousUser.listDevices(),
                        (response: T22Device[]) => of(mapAppSetDevices(response)),
                    );
                case MapAppRemoteRequestType.CREATE_DEVICE:
                    return processCreateDeviceRequest(
                        devicesClient.forAuthenticatedUser.createDevice(
                            $state.value.mapAppState.selectedMarker.location,
                        ),
                    );
                default:
                    return EMPTY;
            }
        }),
    );

function processListDevicesRequest(
    response: Promise<T22Device[]>,
    responseToAction: (response: T22Device[]) => Observable<MapAppAction>,
) {
    return fromPromise(response).pipe(mergeMap(responseToAction), catchError(reportError));
}

function processCreateDeviceRequest(response: Promise<T22Device>) {
    const createDeviceResponse = (response: T22Device) => of(mapAppAddDevice(response));

    return from(response).pipe(mergeMap(createDeviceResponse), catchError(reportError));
}

const reportError = (error) => of(mapAppRemoteErrorAnswer(error));
