import { mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { MapAppActionType, mapAppRemoteAnswer } from '../../mapApp/redux/MapAppAction';
import { RootEpic } from '../../../../redux/store';
import { listDevicesQuery } from './devicesHelpers';

export const devices: RootEpic = (action$, _, { apolloClient }) => {
    return action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        switchMap(() => {
            return fromPromise(apolloClient.query(listDevicesQuery)).pipe(
                mergeMap((response) => {
                    const devices = response.data.T22ListDevices.map((device) => ({
                        id: device.id,
                        location: {
                            lat: device.location.lat,
                            lng: device.location.lon, // TODO rename lng -> lon in local state
                        },
                    }));

                    return of(mapAppRemoteAnswer(devices));
                }),
            );
        }),
    );
};
