import { GeoApifyResponse, buildMapAppAddress } from '../GeoApifyHelpers';
import { MapAppAddress } from '../MapAppState';
import { akTub, chui120, igemberdiyeva42 } from './GeoApifyTestHelpers';

describe('GeoApify API helpers - buildMapAppAddress ', () => {
    function testBuildingAddressFromGeoApifyAPI(geoApifyResponse: GeoApifyResponse, expectedAddress: MapAppAddress) {
        const address = buildMapAppAddress(geoApifyResponse);
        expect(address.line1).toEqual(expectedAddress.line1);
        expect(address.line2).toEqual(expectedAddress.line2);
    }

    it('should provide an error message if no addresses were provided', () => {
        const geoApifyResponse = {
            features: [],
        };

        testBuildingAddressFromGeoApifyAPI(geoApifyResponse, {
            line1: 'mapAppCouldNotRetrieveAddress',
            line2: '',
        });
    });

    it('should get data from the first object', () => {
        const geoApifyResponse = {
            features: [
                {
                    properties: {
                        housenumber: '1',
                        street: '2',
                        district: '3',
                        city: '4',
                    },
                },
                {
                    properties: {
                        housenumber: '5',
                        street: '6',
                        district: '7',
                        city: '8',
                    },
                },
            ],
        };

        testBuildingAddressFromGeoApifyAPI(geoApifyResponse, {
            line1: '2, 1',
            line2: '3, 4',
        });
    });

    it('should build normal address', () => {
        testBuildingAddressFromGeoApifyAPI(chui120.response, {
            line1: 'Чуй, 120',
            line2: 'Первомайский, Бишкек',
        });
    });

    it('should build address without district', () => {
        testBuildingAddressFromGeoApifyAPI(igemberdiyeva42, {
            line1: 'Игембердиева Зыфара, 42а',
            line2: 'Бишкек',
        });
    });

    it('should build address without street number', () => {
        testBuildingAddressFromGeoApifyAPI(akTub, {
            line1: 'Ак-Тюбинская',
            line2: 'Первомайский, Бишкек',
        });
    });
});
