export interface GeoApifyFeature {
    properties: {
        housenumber: string;
        street: string;
        district: string;
        city: string;
    };
}

export interface GeoApifyResponse {
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
