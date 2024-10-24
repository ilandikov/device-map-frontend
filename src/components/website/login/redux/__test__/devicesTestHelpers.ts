import { EMPTY, lastValueFrom, of, toArray } from 'rxjs';
import { StateObservable } from 'redux-observable';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';
import { buildInitialTestState } from '../../../../../redux/__mocks__/stateBuilders';

export async function testDevicesEpic(sentAction: MapAppAction, expectedActions: MapAppAction[]) {
    const initialRootState = buildInitialTestState();
    const output$ = devices(of(sentAction), new StateObservable(EMPTY, initialRootState), { cognitoClient: {} });
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}
