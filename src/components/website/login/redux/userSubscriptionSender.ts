import { ofType } from 'redux-observable';
import { EMPTY, catchError, map, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType, mapAppUserUpdateSubscriptionRequest } from '../../mapApp/redux/MapAppAction';
import { setAuthenticatedClient } from '../../../../client/graphql';

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
