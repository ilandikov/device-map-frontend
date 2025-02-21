import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, of } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { DeviceActionType, deviceRemoteError, updateDevice } from './DeviceAction';

export const deviceSubscriptions: RootEpic = (action$, _, { deviceSubscriptionClient }) =>
    action$.pipe(
        ofType(DeviceActionType.DEVICE_SUBSCRIPTION_REQUEST),
        mergeMap((action) =>
            deviceSubscriptionClient(action.id).pipe(
                map((data) => updateDevice(data.T22OnDeviceCreation)),
                catchError(() => of(deviceRemoteError('could not subscribe to device update'))),
            ),
        ),
    );
