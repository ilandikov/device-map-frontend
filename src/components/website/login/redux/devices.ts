import { Observable, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { MapAppAction, MapAppActionType } from '../../mapApp/redux/MapAppAction';

export function devices(action$, state$, { cognitoClient }): Observable<MapAppAction> {
    return action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        switchMap(() => {
            return of({
                type: MapAppActionType.REMOTE_ANSWER,
                devices: [
                    { id: 'dev1', location: { lat: 42.85862508449081, lng: 74.6085298061371 } },
                    { id: 'dev2a', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                    { id: 'dev2b', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                    { id: 'dev2c', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                    { id: 'dev2d', location: { lat: 42.85883742844907, lng: 74.6039915084839 } },
                    { id: 'dev3', location: { lat: 42.85610049481582, lng: 74.60671663284303 } },
                ],
            });
        }),
    );
}
