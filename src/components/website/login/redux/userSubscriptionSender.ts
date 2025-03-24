import { ofType } from 'redux-observable';
import { EMPTY, catchError, filter, map, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType } from '../../mapApp/redux/MapAppAction';
import { setAuthenticatedClient } from '../../../../client/graphql';
import {
    LoggedInUserAction,
    LoggedInUserActionType,
    loggedInUserSubscriptionRequest,
} from '../../mapApp/redux/LoggedInUserAction';

export const userSubscriptionSender: RootEpic = (action$) => {
    return action$.pipe(
        ofType(MapAppActionType.LOGGED_IN_USER),
        filter((action: LoggedInUserAction) => action.subType === LoggedInUserActionType.SET_ID),
        switchMap(() =>
            fromPromise(setAuthenticatedClient()).pipe(
                map(() => loggedInUserSubscriptionRequest()),
                catchError(() => EMPTY),
            ),
        ),
    );
};
