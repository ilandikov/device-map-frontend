import { Observable, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { MapAppAction, MapAppActionType } from '../../mapApp/redux/MapAppAction';

export function devices(action$, state$, { _cognitoClient }): Observable<MapAppAction> {
    return action$.pipe(
        ofType(MapAppActionType.REMOTE_REQUEST),
        switchMap(() => {
            return of({ type: MapAppActionType.REMOTE_ANSWER, devices: [] });
        }),
    );
}
