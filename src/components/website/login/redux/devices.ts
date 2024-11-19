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
import { RootEpic } from '../../../../redux/store';

export const devices: RootEpic = (action$, $state, { devicesClient }) =>
    action$.pipe(
        ofType(MapAppActionType.MAP_APP_REMOTE_REQUEST),
        switchMap((action) => {
            switch (action.request) {
                case MapAppRemoteRequestType.LIST_DEVICES:
                    return processListDevicesRequest<T22Device[]>(
                        devicesClient.forAnonymousUser.listDevices(),
                        (response) => of(mapAppSetDevices(response)),
                    );
                case MapAppRemoteRequestType.CREATE_DEVICE:
                    return processListDevicesRequest<T22Device>(
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

function processListDevicesRequest<TResponse>(
    response: Promise<TResponse>,
    responseToAction: (response: TResponse) => Observable<MapAppAction>,
) {
    return fromPromise(response).pipe(mergeMap(responseToAction), catchError(reportError));
}

const reportError = (error) => of(mapAppRemoteErrorAnswer(error));
