import { ofType } from 'redux-observable';
import { catchError, mergeMap, of, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType, mapAppGetLoggedInUserError, mapAppSetLoggedInUser } from './MapAppAction';

export const user: RootEpic = (action$, _, { usersClient }) =>
    action$.pipe(
        ofType(MapAppActionType.AUTHENTICATION_COMPLETED),
        switchMap(() =>
            fromPromise(usersClient()).pipe(
                mergeMap((response) => of(mapAppSetLoggedInUser(response))),
                catchError((error) => of(mapAppGetLoggedInUserError(error))),
            ),
        ),
    );
