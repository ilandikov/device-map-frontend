import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, of } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { DeviceActionType, deviceCreated2, deviceRemoteError } from './DeviceAction';

export const deviceSubscriptions: RootEpic = (action$, _, { deviceSubscriptionClient }) =>
    action$.pipe(
        ofType(DeviceActionType.DEVICE_SUBSCRIPTION_REQUEST),
        mergeMap((action) =>
            deviceSubscriptionClient(action.id).pipe(
                map((data) => deviceCreated2(data.T22OnDeviceCreation)),
                catchError(() => of(deviceRemoteError('could not subscribe to device update'))),
            ),
        ),
    );
