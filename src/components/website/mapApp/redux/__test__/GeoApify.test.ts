import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction, mapAppGetLocationAddress, mapAppSetLocationAddress } from '../MapAppAction';
import { GeoApify } from '../GeoApify';
import { MapAppState, buildMapAppState } from '../MapAppState';

async function testGeoApifyEpic(mapAppState: MapAppState, sentAction: MapAppAction, expectedAction: MapAppAction) {
    const output$ = GeoApify(of(sentAction), { value: { mapAppState } }, { cognitoClient: {} });
    const receivedActions = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedActions).toEqual([expectedAction]);
}

describe('GeoApify tests', () => {
    it('should get address for a location in Bishkek', async () => {
        const sentAction = mapAppGetLocationAddress({ lat: 42.875352500000005, lng: 74.60261920574811 });
        const expectedAction = mapAppSetLocationAddress({
            addressLine1: 'Чуй, 120',
            addressLine2: 'Первомайский, Бишкек',
        });

        await testGeoApifyEpic(buildMapAppState({}), sentAction, expectedAction);
    });
});
