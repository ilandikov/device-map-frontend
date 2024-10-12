import { GeoApifyResponse, buildMapAppAddress } from '../GeoApifyHelpers';

describe('GeoApify API helpers - error cases', () => {
    it('should provide an error message if no addresses were provided', () => {
        const geoApifyResponse: GeoApifyResponse = {
            features: [],
        };

        const address = buildMapAppAddress(geoApifyResponse);

        expect(address.addressLine1).toEqual('mapAppCoundNotRetrieveAddress');
        expect(address.addressLine2).toEqual('');
    });

    it('should get data from the first object', () => {
        const geoApifyResponse: GeoApifyResponse = {
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

        const address = buildMapAppAddress(geoApifyResponse);

        expect(address.addressLine1).toEqual('2, 1');
        expect(address.addressLine2).toEqual('3, 4');
    });
});
