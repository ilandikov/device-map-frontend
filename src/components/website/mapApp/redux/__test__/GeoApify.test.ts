import { lastValueFrom, of, toArray } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AjaxResponse } from 'rxjs/internal/ajax/AjaxResponse';
import { MapAppAction, mapAppGetLocationAddress, mapAppSetLocationAddress } from '../MapAppAction';
import { GeoApify } from '../GeoApify';
import { buildStateForGeoApifyTest } from '../../../../../redux/__mocks__/stateBuilders';
import { GeoApifyResponse } from '../GeoApifyHelpers';

async function testGeoApifyEpic(
    remoteAnswer: Promise<AjaxResponse<GeoApifyResponse>>,
    sentAction: MapAppAction,
    expectedAction: MapAppAction,
) {
    const output$ = GeoApify(of(sentAction), buildStateForGeoApifyTest(), {
        geoApifyClient: () => fromPromise(remoteAnswer),
    });
    const receivedActions = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedActions).toEqual([expectedAction]);
}

describe('GeoApify tests', () => {
    it('should get address for a location in Bishkek', async () => {
        const sentAction = mapAppGetLocationAddress({ lat: 42.875352500000005, lon: 74.60261920574811 });
        const expectedAction = mapAppSetLocationAddress({
            addressLine1: 'Чуй, 120',
            addressLine2: 'Первомайский, Бишкек',
        });

        await testGeoApifyEpic(Promise.resolve(chui120Response), sentAction, expectedAction);
    });
});

const chui120Response: AjaxResponse<GeoApifyResponse> = {
    // @ts-expect-error
    originalEvent: {
        isTrusted: true,
    },
    // @ts-expect-error
    xhr: {},
    request: {
        async: true,
        crossDomain: true,
        withCredentials: false,
        method: 'GET',
        timeout: 0,
        responseType: 'json',
        url: 'https://api.geoapify.com/v1/geocode/reverse?lat=42.875352500000005&lon=74.60261920574811&apiKey=8b2ff18a6cd44e7a9a916eb52cc51f8b&lang=ru',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
        },
    },
    type: 'download_load',
    status: 200,
    responseType: 'json',
    responseHeaders: {
        'cache-control': 'private, max-age=0, no-cache',
        'content-type': 'application/json; charset=utf-8',
    },
    response: {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {
                    datasource: {
                        sourcename: 'openstreetmap',
                        attribution: '© OpenStreetMap contributors',
                        license: 'Open Database License',
                        url: 'https://www.openstreetmap.org/copyright',
                    },
                    country: 'Киргизия',
                    country_code: 'kg',
                    city: 'город Бишкек',
                    postcode: '720014',
                    district: 'Первомайский район',
                    street: 'Чуй проспект',
                    housenumber: '120',
                    lon: 74.60261920574811,
                    lat: 42.875352500000005,
                    distance: 0,
                    result_type: 'building',
                    formatted: 'Киргизия, 720014 город Бишкек, Чуй проспект, 120',
                    address_line1: 'Киргизия',
                    address_line2: '720014 город Бишкек, Чуй проспект, 120',
                    category: 'building',
                    timezone: {
                        name: 'Asia/Bishkek',
                        offset_STD: '+06:00',
                        offset_STD_seconds: 21600,
                        offset_DST: '+06:00',
                        offset_DST_seconds: 21600,
                    },
                    plus_code: '8JJPVJG3+42',
                    rank: {
                        importance: 0.00000999999999995449,
                        popularity: 6.010418078825558,
                    },
                    place_id: '514c28255091a652405966fcfb8c0b704540f00102f90123f4fc0900000000c00203',
                },
                geometry: {
                    type: 'Point',
                    coordinates: [74.60261920574811, 42.875352500000005],
                },
                bbox: [74.6012645, 42.8749146, 74.6027371, 42.8759614],
            },
        ],
        query: {
            lat: 42.875352500000005,
            lon: 74.60261920574811,
            plus_code: '8JJPVJG3+42',
        },
    },
    loaded: 1305,
    total: 0,
};
