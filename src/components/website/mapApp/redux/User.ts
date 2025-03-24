import { ofType } from 'redux-observable';
import { catchError, mergeMap, of, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType } from './MapAppAction';
import { loggedInUserError, loggedInUserSet } from './LoggedInUserAction';

export const user: RootEpic = (action$, _, { usersClient }) =>
    action$.pipe(
        ofType(MapAppActionType.LOGGED_IN_USER_SET_ID),
        switchMap(() =>
            fromPromise(usersClient.getUser()).pipe(
                mergeMap((response) => of(loggedInUserSet(response.user))),
                catchError((error) => of(loggedInUserError(error))),
            ),
        ),
    );
