import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppState } from '../MapAppState';
import { MapAppAction } from '../MapAppAction';
import { GeoApify } from '../GeoApify';

export async function testGeoApifyEpic(
    mapAppState: MapAppState,
    sentAction: MapAppAction,
    expectedAction: MapAppAction,
) {
    const output$ = GeoApify(of(sentAction), { value: { mapAppState } }, { cognitoClient: {} });
    const receivedActions = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedActions).toEqual([expectedAction]);
}

export async function testGeoApifyEpicNoAction(mapAppState: MapAppState, sentAction: MapAppAction) {
    const output$ = GeoApify(of(sentAction), { value: { mapAppState } }, { cognitoClient: {} });
    const receivedActions = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedActions).toEqual([]);
}
