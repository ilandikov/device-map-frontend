import { GeoApifyResponse, buildMapAppAddress } from '../GeoApifyHelpers';
import { MapAppAddress } from '../MapAppState';
import { akTub, zyfara42a } from './GeoApifyTestData';
import { chui120Response } from './GeoApifyTestHelpers';

describe('GeoApify API helpers - buildMapAppAddress ', () => {
    function testBuildingAddressFromGeoApifyAPI(geoApifyResponse: GeoApifyResponse, expectedAddress: MapAppAddress) {
        const address = buildMapAppAddress(geoApifyResponse);
        expect(address.addressLine1).toEqual(expectedAddress.addressLine1);
        expect(address.addressLine2).toEqual(expectedAddress.addressLine2);
    }

    it('should provide an error message if no addresses were provided', () => {
        const geoApifyResponse = {
            features: [],
        };

        testBuildingAddressFromGeoApifyAPI(geoApifyResponse, {
            addressLine1: 'mapAppCouldNotRetrieveAddress',
            addressLine2: '',
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
            addressLine1: '2, 1',
            addressLine2: '3, 4',
        });
    });

    it('should build normal address', () => {
        testBuildingAddressFromGeoApifyAPI(chui120Response.response, {
            addressLine1: 'Чуй, 120',
            addressLine2: 'Первомайский, Бишкек',
        });
    });

    it('should build address without district', () => {
        testBuildingAddressFromGeoApifyAPI(zyfara42a, {
            addressLine1: 'Игембердиева Зыфара, 42а',
            addressLine2: 'Бишкек',
        });
    });

    it('should build address without street number', () => {
        testBuildingAddressFromGeoApifyAPI(akTub, {
            addressLine1: 'Ак-Тюбинская',
            addressLine2: 'Первомайский, Бишкек',
        });
    });
});
