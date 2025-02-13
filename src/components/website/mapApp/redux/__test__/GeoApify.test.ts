import { mapAppGetLocationAddress, mapAppSetLocationAddress } from '../MapAppAction';
import { rejectingAddressClient, resolvingAddressClient, testGeoApifyEpic } from './GeoApifyTestHelpers';

describe('GeoApify tests', () => {
    it('should not answer to a random action', async () => {
        const sentAction = { type: 'RANDOM_ACTION' };

        // @ts-expect-error
        await testGeoApifyEpic(resolvingAddressClient, sentAction, []);
    });

    it('should get address for a location in Bishkek', async () => {
        const sentAction = mapAppGetLocationAddress({ lat: 42.875352500000005, lon: 74.60261920574811 });
        const expectedAction = mapAppSetLocationAddress({
            line1: 'Чуй, 120',
            line2: 'Первомайский, Бишкек',
        });

        await testGeoApifyEpic(resolvingAddressClient, sentAction, [expectedAction]);
    });

    it('should show error from the remote', async () => {
        const sentAction = mapAppGetLocationAddress({ lat: 42.875352500000005, lon: 74.60261920574811 });

        // TODO send a normal action here, maybe reuse existing error action
        // @ts-expect-error
        await testGeoApifyEpic(rejectingAddressClient, sentAction, ['something went wrong']);
    });
});
