import { EMPTY, Observable, catchError, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { Query, T22Device } from '@mancho-school-t22/graphql-types';
import {
    MapAppAction,
    MapAppActionType,
    MapAppRemoteRequestType,
    mapAppAddDevice,
    mapAppRemoteErrorAnswer,
    mapAppSetDevices,
} from '../../mapApp/redux/MapAppAction';
import { DevicesClient, RootEpic } from '../../../../redux/store';

export const devices: RootEpic = (action$, _, { devicesClient }) =>
    action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        switchMap((action) => {
            switch (action.request) {
                case MapAppRemoteRequestType.LIST_DEVICES:
                    return processListDevicesRequest(
                        appleSauce[action.request].call(devicesClient),
                        appleSauce[action.request].responseProcessor,
                    );
                case MapAppRemoteRequestType.CREATE_DEVICE:
                    return processCreateDeviceRequest(devicesClient.createDevice());
                default:
                    return EMPTY;
            }
        }),
    );

const appleSauce: Partial<{
    [key in MapAppRemoteRequestType]: {
        call: (client: DevicesClient) => Promise<Query>;
        responseProcessor: (response: Query) => Observable<MapAppAction>;
    };
}> = {
    LIST_DEVICES: {
        call: (client) => client.listDevices(),
        responseProcessor: (response: Query) => of(mapAppSetDevices(response.T22ListDevices)),
    },
};

function processListDevicesRequest(
    response: Promise<Query>,
    responseProcessor: (response: Query) => Observable<MapAppAction>,
) {
    return fromPromise(response).pipe(mergeMap(responseProcessor), catchError(reportError));
}

function processCreateDeviceRequest(response: Promise<T22Device>) {
    const createDeviceResponse = (response: T22Device) => of(mapAppAddDevice(response));

    return fromPromise(response).pipe(mergeMap(createDeviceResponse), catchError(reportError));
}

const reportError = (error) => of(mapAppRemoteErrorAnswer(error));
