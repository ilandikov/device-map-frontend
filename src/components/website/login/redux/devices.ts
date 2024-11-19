import { EMPTY, catchError, from, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import {
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
                    return processListDevicesRequest(devicesClient.forAnonymousUser.listDevices());
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

function processListDevicesRequest(response: Promise<T22Device[]>) {
    const listDevicesResponse = (response: T22Device[]) => of(mapAppSetDevices(response));

    return fromPromise(response).pipe(mergeMap(listDevicesResponse), catchError(reportError));
}

function processCreateDeviceRequest(response: Promise<T22Device>) {
    const createDeviceResponse = (response: T22Device) => of(mapAppAddDevice(response));

    return from(response).pipe(mergeMap(createDeviceResponse), catchError(reportError));
}

const reportError = (error) => of(mapAppRemoteErrorAnswer(error));
