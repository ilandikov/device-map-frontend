import { EMPTY, Observable, catchError, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { T22Device } from '@mancho-school-t22/graphql-types';
import {
    MapAppActionType,
    MapAppRemoteRequestType,
    MapAppSetDevices,
    mapAppAddDevice,
    mapAppRemoteErrorAnswer,
    mapAppSetDevices,
} from '../../mapApp/redux/MapAppAction';
import { RootEpic } from '../../../../redux/store';

export const devices: RootEpic = (action$, _, { devicesClient }) =>
    action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        switchMap((action) => {
            switch (action.request) {
                case MapAppRemoteRequestType.LIST_DEVICES:
                    return processListDevicesRequest(devicesClient.listDevices(), (response: T22Device[]) =>
                        of(mapAppSetDevices(response)),
                    );
                case MapAppRemoteRequestType.CREATE_DEVICE:
                    return processCreateDeviceRequest(devicesClient.createDevice());
                default:
                    return EMPTY;
            }
        }),
    );

function processListDevicesRequest(
    response: Promise<T22Device[]>,
    responseProcessor: (response: T22Device[]) => Observable<MapAppSetDevices>,
) {
    return fromPromise(response).pipe(mergeMap(responseProcessor), catchError(reportError));
}

function processCreateDeviceRequest(response: Promise<T22Device>) {
    const createDeviceResponse = (response: T22Device) => of(mapAppAddDevice(response));

    return fromPromise(response).pipe(mergeMap(createDeviceResponse), catchError(reportError));
}

const reportError = (error) => of(mapAppRemoteErrorAnswer(error));
