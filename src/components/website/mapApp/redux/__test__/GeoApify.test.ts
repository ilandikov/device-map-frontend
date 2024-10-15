import { mapAppGetLocationAddress, mapAppSetLocationAddress } from '../MapAppAction';
import { buildMapAppState } from '../MapAppState';
import { testGeoApifyEpic } from './GeoApifyTestHelpers';

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
