import { MapAppAddress } from './MapAppState';

export function convertPropertiesToAddress(properties: GeoApifyProperties) {
    const street = properties.street.replace(/ улица$/m, '');

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

export function buildMapAppAddress(response: GeoApifyResponse): MapAppAddress {
    const geoApifyFeatures = response.features;

    if (geoApifyFeatures.length === 0) {
        return { addressLine1: 'mapAppCouldNotRetrieveAddress', addressLine2: '' };
    }

    return convertPropertiesToAddress(geoApifyFeatures[0].properties);
}

export interface GeoApifyProperties {
    housenumber?: string;
    street?: string;
    district?: string;
    city?: string;
}

export interface GeoApifyFeature {
    properties: GeoApifyProperties;
}

export interface GeoApifyResponse {
    features: GeoApifyFeature[];
}
