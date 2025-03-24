import { ofType } from 'redux-observable';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType } from './MapAppAction';
import { mapAppSubscriptionError, mapAppUpdateLoggedInUser } from './LoggedInUserAction';

export const userSubscriptions: RootEpic = (action$, state$, { usersClient }) =>
    action$.pipe(
        ofType(MapAppActionType.USER_UPDATE_SUBSCRIPTION_REQUEST),
        mergeMap(() =>
            new Observable(usersClient.subscribeForUpdate(state$.value.mapAppState.loggedInUser.id)).pipe(
                map((user) => mapAppUpdateLoggedInUser(user)),
                catchError(() => of(mapAppSubscriptionError('could not subscribe to user update'))),
            ),
        ),
    );
