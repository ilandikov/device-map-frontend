import { MapAppAddress } from './MapAppState';

export function buildMapAppAddress(response: GeoApifyResponse): MapAppAddress {
    const geoApifyFeatures = response.features;

    if (geoApifyFeatures.length === 0) {
        return { addressLine1: 'mapAppCouldNotRetrieveAddress', addressLine2: '' };
    }

    const properties = geoApifyFeatures[0].properties;
    const street = properties.street.replace(/ улица$/m, '').replace(/ проспект$/m, '');

    let housenumber = '';
    if (properties.housenumber) {
        housenumber = `, ${properties.housenumber}`;
    }

    let district = '';
    if (properties.district) {
        district = `${properties.district.replace(/ район$/m, '')}, `;
    }

    const city = properties.city?.replace(/^город /m, '') ?? '';
    return {
        addressLine1: `${street}${housenumber}`,
        addressLine2: `${district}${city}`,
    };
}

export interface GeoApifyProperties {
    datasource?: any;
    timezone?: any;
    rank?: any;

    state?: string;
    name?: string;
    housenumber?: string;
    street?: string;
    district?: string;
    city?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
    lon?: number;
    lat?: number;
    distance?: number;
    result_type?: string;
    formatted?: string;
    address_line1?: string;
    address_line2?: string;
    category?: string;
    plus_code?: string;
    place_id?: string;
}

export interface GeoApifyFeature {
    type?: 'Feature';
    properties: GeoApifyProperties;
    geometry?: any;
    bbox?: any;
}

export interface GeoApifyResponse {
    type?: 'FeatureCollection';
    features: GeoApifyFeature[];
    query?: {
        lat?: number;
        lon?: number;
        plus_code?: string;
    };
}
