import { mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { MapAppActionType, mapAppRemoteAnswer } from '../../mapApp/redux/MapAppAction';
import { RootEpic } from '../../../../redux/store';

export const devices: RootEpic = (action$) => {
    return action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        switchMap(() => {
            return fromPromise(
                Promise.resolve({
                    data: [
                        { id: 'dev1', location: { lat: 42.85862508449081, lng: 74.6085298061371 } },
                        { id: 'dev2a', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                        { id: 'dev2b', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                        { id: 'dev2c', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                        { id: 'dev2d', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                        { id: 'dev3', location: { lat: 42.85610049481582, lng: 74.60671663284303 } },
                    ],
                }),
            ).pipe(
                mergeMap((response) => {
                    return of(mapAppRemoteAnswer(response.data));
                }),
            );
        }),
    );
};
