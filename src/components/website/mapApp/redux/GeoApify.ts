import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { catchError, map, mergeMap } from 'rxjs';
import { MapAppActionType, mapAppSetLocationAddress } from './MapAppAction';

export function GeoApify(action$, _state$, { cognitoClient }) {
    return action$.pipe(
        ofType(MapAppActionType.GET_LOCATION_ADDRESS),
        mergeMap((action: any) => {
            const location = action.location;
            const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lng}&apiKey=8b2ff18a6cd44e7a9a916eb52cc51f8b&lang=ru`;
            return ajax<GeoApifyResponse>({
                url,
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                crossDomain: true,
            }).pipe(
                map((ajaxResponse) => {
                    const response = ajaxResponse.response;
                    const properties = response.features[0].properties;
                    return mapAppSetLocationAddress(
                        `${properties.street}, ${properties.housenumber}`,
                        `${properties.district}, ${properties.city}`,
                    );
                }),
                catchError((error) => error),
            );
        }),
    );
}

interface GeoApifyFeature {
    properties: {
        housenumber: string;
        street: string;
        district: string;
        city: string;
    };
}

interface GeoApifyResponse {
    features: GeoApifyFeature[];
}

// const exampleOfApiReturn = {
//     type: 'FeatureCollection',
//     features: [
//         {
//             type: 'Feature',
//             properties: {
//                 datasource: {
//                     sourcename: 'openstreetmap',
//                     attribution: '© OpenStreetMap contributors',
//                     license: 'Open Database License',
//                     url: 'https://www.openstreetmap.org/copyright',
//                 },
//                 country: 'Киргизия',
//                 country_code: 'kg',
//                 city: 'город Бишкек',
//                 postcode: '720014',
//                 district: 'Первомайский район',
//                 street: 'Чуй проспект',
//                 housenumber: '120',
//                 lon: 74.60261920574811,
//                 lat: 42.875352500000005,
//                 distance: 23.379476026463426,
//                 result_type: 'building',
//                 formatted: 'Киргизия, 720014 город Бишкек, Чуй проспект, 120',
//                 address_line1: 'Киргизия',
//                 address_line2: '720014 город Бишкек, Чуй проспект, 120',
//                 category: 'building',
//                 timezone: {
//                     name: 'Asia/Bishkek',
//                     offset_STD: '+06:00',
//                     offset_STD_seconds: 21600,
//                     offset_DST: '+06:00',
//                     offset_DST_seconds: 21600,
//                 },
//                 plus_code: '8JJPVJG3+42',
//                 rank: { importance: 0.00000999999999995449, popularity: 6.010418078825558 },
//                 place_id: '514c28255091a652405966fcfb8c0b704540f00102f90123f4fc0900000000c00203',
//             },
//             geometry: { type: 'Point', coordinates: [74.60261920574811, 42.875352500000005] },
//             bbox: [74.6012645, 42.8749146, 74.6027371, 42.8759614],
//         },
//     ],
//     query: { lat: 42.876, lon: 74.603, plus_code: '8JJPVJG3+C6' },
// };
