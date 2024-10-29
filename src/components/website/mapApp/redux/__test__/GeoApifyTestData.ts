import { GeoApifyResponse } from '../GeoApifyHelpers';

export const zyfara42a: GeoApifyResponse = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [74.603827, 42.858792],
            },
            properties: {
                country_code: 'kg',
                housenumber: '42а',
                street: 'Игембердиева Зыфара улица',
                country: 'Киргизия',
                datasource: {
                    sourcename: 'openstreetmap',
                    attribution: '© OpenStreetMap contributors',
                    license: 'Open Database License',
                    url: 'https://www.openstreetmap.org/copyright',
                },
                state: 'Бишкек',
                city: 'Бишкек',
                lon: 74.603827,
                lat: 42.858792,
                distance: 14.328938605296244,
                result_type: 'building',
                postcode: '720053',
                formatted: 'Киргизия, Бишкек, 720053 Бишкек, Игембердиева Зыфара улица, 42а',
                address_line1: 'Киргизия',
                address_line2: 'Бишкек, 720053 Бишкек, Игембердиева Зыфара улица, 42а',
                timezone: {
                    name: 'Asia/Bishkek',
                    offset_STD: '+06:00',
                    offset_STD_seconds: 21600,
                    offset_DST: '+06:00',
                    offset_DST_seconds: 21600,
                },
                plus_code: '8JJPVJ53+GG',
                rank: {
                    popularity: 5.724998061641535,
                },
                place_id:
                    '51465c001aa5a6524059810871e5ec6d4540f00102f901f01f490b00000000c00203e203236f70656e7374726565746d61703a616464726573733a7761792f313839333431363830',
            },
        },
    ],
    query: {
        lat: 42.85883742844907,
        lon: 74.6039915084839,
        plus_code: '8JJPVJ53+GH',
    },
};

export const akTub: GeoApifyResponse = {
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
                name: 'Футболистан',
                country: 'Киргизия',
                country_code: 'kg',
                city: 'город Бишкек',
                postcode: '720031',
                district: 'Первомайский район',
                street: 'Ак-Тюбинская улица',
                lon: 74.60680456094337,
                lat: 42.85586355,
                distance: 0,
                result_type: 'amenity',
                formatted: 'Футболистан, Киргизия, 720031 город Бишкек, Ак-Тюбинская улица',
                address_line1: 'Футболистан',
                address_line2: 'Киргизия, 720031 город Бишкек, Ак-Тюбинская улица',
                category: 'sport.pitch',
                timezone: {
                    name: 'Asia/Bishkek',
                    offset_STD: '+06:00',
                    offset_STD_seconds: 21600,
                    offset_DST: '+06:00',
                    offset_DST_seconds: 21600,
                },
                plus_code: '8JJPVJ44+8P',
                rank: {
                    importance: 0.00000999999999995449,
                    popularity: 6.000504219249871,
                },
                place_id:
                    '513014cce2d5a6524059538bd2ef8c6d4540f00102f9011cc2010300000000c00201920316d0a4d183d182d0b1d0bed0bbd0b8d181d182d0b0d0bd',
            },
            geometry: {
                type: 'Point',
                coordinates: [74.60680456094337, 42.85586355],
            },
            bbox: [74.6063648, 42.855224, 74.6072521, 42.856555],
        },
    ],
    query: {
        lat: 42.85610049481582,
        lon: 74.60671663284303,
        plus_code: '8JJPVJ44+CM',
    },
};
