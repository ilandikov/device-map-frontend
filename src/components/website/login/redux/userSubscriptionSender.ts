import { ofType } from 'redux-observable';
import { EMPTY, catchError, map, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType } from '../../mapApp/redux/MapAppAction';
import { setAuthenticatedClient } from '../../../../client/graphql';
import { mapAppUserUpdateSubscriptionRequest } from '../../mapApp/redux/LoggedInUserAction';

export const userSubscriptionSender: RootEpic = (action$) => {
    return action$.pipe(
        ofType(MapAppActionType.SET_LOGGED_IN_USER_ID),
        switchMap(() =>
            fromPromise(setAuthenticatedClient()).pipe(
                map(() => mapAppUserUpdateSubscriptionRequest()),
                catchError(() => EMPTY),
            ),
        ),
    );
};
