import { ofType } from 'redux-observable';
import { catchError, mergeMap, of, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType, mapAppGetUserPointsError, mapAppSetUserPoints } from '../../mapApp/redux/MapAppAction';

export const user: RootEpic = (action$, _, { userClient }) =>
    action$.pipe(
        ofType(MapAppActionType.GET_USER_POINTS),
        switchMap(() =>
            fromPromise(userClient()).pipe(
                mergeMap((response) => of(mapAppSetUserPoints(response.points))),
                catchError((error) => of(mapAppGetUserPointsError(error))),
            ),
        ),
    );
