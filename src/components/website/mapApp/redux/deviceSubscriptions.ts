import { ofType } from 'redux-observable';
import { Observable, catchError, endWith, map, mergeMap, of } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { DeviceActionType, deviceCreated, deviceCreation, deviceRemoteError } from './DeviceAction';

export const deviceSubscriptions: RootEpic = (action$, state$, { deviceSubscriptionClient }) =>
    action$.pipe(
        ofType(DeviceActionType.DEVICE_SUBSCRIPTION_REQUEST),
        mergeMap(() =>
            new Observable(deviceSubscriptionClient.creation(state$.value.mapAppState.loggedInUser.id)).pipe(
                map((device) => deviceCreated(device)),
                catchError(() => of(deviceRemoteError('could not subscribe to device update'))),
                endWith(deviceCreation(false)),
            ),
        ),
    );
