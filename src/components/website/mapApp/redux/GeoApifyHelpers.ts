import { MapAppAddress } from './MapAppState';

export function buildMapAppAddress(response: GeoApifyResponse): MapAppAddress {
    const geoApifyFeatures = response.features;

    if (geoApifyFeatures.length === 0) {
        return { addressLine1: 'mapAppCouldNotRetrieveAddress', addressLine2: '' };
    }

    const properties = geoApifyFeatures[0].properties;
    return {
        addressLine1: `${properties.street}, ${properties.housenumber}`,
        addressLine2: `${properties.district}, ${properties.city}`,
    };
}

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
