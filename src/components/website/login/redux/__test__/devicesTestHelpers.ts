import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';

export async function testDevicesEpic(sentAction: MapAppAction, expectedActions: MapAppAction[]) {
    const output$ = devices(
        of(sentAction),
        {
            value: {},
        },
        {
            cognitoClient: {},
        },
    );
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}
