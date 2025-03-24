import { ofType } from 'redux-observable';
import { catchError, filter, mergeMap, of, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType } from './MapAppAction';
import { LoggedInUserAction, LoggedInUserActionType, loggedInUserError, loggedInUserSet } from './LoggedInUserAction';

export const user: RootEpic = (action$, _, { usersClient }) =>
    action$.pipe(
        ofType(MapAppActionType.LOGGED_IN_USER_SET_ID),
        filter((action: LoggedInUserAction) => action.subType === LoggedInUserActionType.SET_ID),
        switchMap(() =>
            fromPromise(usersClient.getUser()).pipe(
                mergeMap((response) => of(loggedInUserSet(response.user))),
                catchError((error) => of(loggedInUserError(error))),
            ),
        ),
    );
