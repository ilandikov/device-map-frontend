import { ofType } from 'redux-observable';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { DeviceActionType, deviceRemoteError, updateDevice } from './DeviceAction';

export const deviceSubscriptions: RootEpic = (action$, state$, { deviceSubscriptionClient }) =>
    action$.pipe(
        ofType(DeviceActionType.DEVICE_SUBSCRIPTION_REQUEST),
        mergeMap(() =>
            new Observable(deviceSubscriptionClient.creation(state$.value.mapAppState.loggedInUser.id)).pipe(
                map((device) => updateDevice(device)),
                catchError(() => of(deviceRemoteError('could not subscribe to device update'))),
            ),
        ),
    );
