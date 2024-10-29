import { mapAppGetLocationAddress, mapAppSetLocationAddress } from '../MapAppAction';
import { chui120Response, testGeoApifyEpic } from './GeoApifyTestHelpers';

describe('GeoApify tests', () => {
    it('should not answer to a random action', async () => {
        const sentAction = { type: 'RANDOM_ACTION' };

        // @ts-expect-error
        await testGeoApifyEpic(Promise.resolve({}), sentAction, []);
    });

    it('should get address for a location in Bishkek', async () => {
        const remoteAnswer = Promise.resolve(chui120Response);
        const sentAction = mapAppGetLocationAddress({ lat: 42.875352500000005, lon: 74.60261920574811 });
        const expectedAction = mapAppSetLocationAddress({
            addressLine1: 'Чуй, 120',
            addressLine2: 'Первомайский, Бишкек',
        });

        await testGeoApifyEpic(remoteAnswer, sentAction, [expectedAction]);
    });

    it('should show error from the remote', async () => {
        const remoteAnswer = Promise.reject('something went wrong');
        const sentAction = mapAppGetLocationAddress({ lat: 42.875352500000005, lon: 74.60261920574811 });

        // @ts-expect-error
        await testGeoApifyEpic(remoteAnswer, sentAction, ['something went wrong']);
    });
});
