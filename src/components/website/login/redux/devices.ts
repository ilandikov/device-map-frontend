import { EMPTY, catchError, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { T22Device } from '@mancho-school-t22/graphql-types';
import {
    MapAppActionType,
    MapAppRemoteRequestType,
    mapAppAddDevice,
    mapAppSetDevices,
} from '../../mapApp/redux/MapAppAction';
import { Device } from '../../mapApp/redux/MapAppState';
import { RootEpic } from '../../../../redux/store';

export const devices: RootEpic = (action$, state$, { apolloClient }) =>
    action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        switchMap((action) => {
            switch (action.request) {
                case MapAppRemoteRequestType.LIST_DEVICES:
                    return processListDevicesRequest(apolloClient.listDevices());
                case MapAppRemoteRequestType.CREATE_DEVICE:
                    return of(
                        mapAppAddDevice({
                            id: 'testId',
                            location: state$.value.mapAppState.selectedMarker.location,
                        }),
                    );
                default:
                    return EMPTY;
            }
        }),
    );

export function processListDevicesRequest(response: Promise<T22Device[]>) {
    const deviceTransformer = (device: T22Device): Device => ({
        id: device.id,
        location: {
            lat: device.location.lat,
            lon: device.location.lon,
        },
    });

    const listDevicesResponse = (response: T22Device[]) => of(mapAppSetDevices(response.map(deviceTransformer)));

    const doNothing = () => EMPTY;

    return fromPromise(response).pipe(mergeMap(listDevicesResponse), catchError(doNothing));
}
