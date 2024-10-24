import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';

export async function testDevicesEpic(sentAction: MapAppAction, expectedActions: any[]) {
    const output$ = devices(
        of(sentAction),
        {
            value: {},
        },
        {
            _cognitoClient: {},
        },
    );
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}
