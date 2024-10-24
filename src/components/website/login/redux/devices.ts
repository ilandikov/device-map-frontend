import { Observable, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { MapAppAction, MapAppActionType, MapAppRemoteRequest } from '../../mapApp/redux/MapAppAction';

export function devices(action$, state$, { _cognitoClient }): Observable<MapAppAction> {
    return action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        switchMap((action: MapAppRemoteRequest) => {
            return of({ type: MapAppActionType.REMOTE_ANSWER });
        }),
    );
}
