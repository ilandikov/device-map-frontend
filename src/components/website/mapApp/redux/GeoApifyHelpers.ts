import { MapAppAddress } from './MapAppState';

export function convertPropertiesToAddress(properties: GeoApifyProperties) {
    return {
        addressLine1: `${properties.street}, ${properties.housenumber}`,
        addressLine2: `${properties.district}, ${properties.city}`,
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
    housenumber: string;
    street: string;
    district: string;
    city: string;
}

export interface GeoApifyFeature {
    properties: GeoApifyProperties;
}

export interface GeoApifyResponse {
    features: GeoApifyFeature[];
}
