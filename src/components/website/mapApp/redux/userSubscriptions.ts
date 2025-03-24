import { ofType } from 'redux-observable';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType } from './MapAppAction';
import { loggedInUserSubscriptionError, loggedInUserUpdate } from './LoggedInUserAction';

export const userSubscriptions: RootEpic = (action$, state$, { usersClient }) =>
    action$.pipe(
        ofType(MapAppActionType.LOGGED_IN_USER_SUBSCRIPTION_REQUEST),
        mergeMap(() =>
            new Observable(usersClient.subscribeForUpdate(state$.value.mapAppState.loggedInUser.id)).pipe(
                map((user) => loggedInUserUpdate(user)),
                catchError(() => of(loggedInUserSubscriptionError('could not subscribe to user update'))),
            ),
        ),
    );
