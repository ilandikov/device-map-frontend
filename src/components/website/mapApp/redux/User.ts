import { ofType } from 'redux-observable';
import { catchError, mergeMap, of, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType } from './MapAppAction';
import { mapAppGetLoggedInUserError, mapAppSetLoggedInUser } from './LoggedInUserAction';

export const user: RootEpic = (action$, _, { usersClient }) =>
    action$.pipe(
        ofType(MapAppActionType.SET_LOGGED_IN_USER_ID),
        switchMap(() =>
            fromPromise(usersClient.getUser()).pipe(
                mergeMap((response) => of(mapAppSetLoggedInUser(response.user))),
                catchError((error) => of(mapAppGetLoggedInUserError(error))),
            ),
        ),
    );
