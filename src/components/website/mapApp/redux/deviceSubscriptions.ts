import { ofType } from 'redux-observable';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { DeviceActionType, deviceRemoteError, updateDevice } from './DeviceAction';

export const deviceSubscriptions: RootEpic = (action$, state$, { deviceSubscriptionClient }) =>
    action$.pipe(
        ofType(DeviceActionType.DEVICE_SUBSCRIPTION_REQUEST),
        mergeMap(() =>
            new Observable(deviceSubscriptionClient(state$.value.mapAppState.loggedInUser.id)).pipe(
                map((data) => updateDevice(data)),
                catchError(() => of(deviceRemoteError('could not subscribe to device update'))),
            ),
        ),
    );
