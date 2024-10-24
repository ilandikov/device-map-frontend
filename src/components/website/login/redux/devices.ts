import { EMPTY, Observable, switchMap } from 'rxjs';
import { MapAppAction } from '../../mapApp/redux/MapAppAction';

export function devices(action$, state$, { _cognitoClient }): Observable<MapAppAction> {
    return action$.pipe(
        switchMap(() => {
            return EMPTY;
        }),
    );
}
