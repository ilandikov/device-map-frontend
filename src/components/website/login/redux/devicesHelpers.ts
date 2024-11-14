import { gql } from '@apollo/client';

export const listDevicesQuery = {
    query: gql`
        query {
            T22ListDevices {
                id
                location {
                    lat
                    lon
                }
            }
        }
    `,
    variables: {},
};

export const createDeviceMutation = gql`
    mutation ($lat: Float!, $lon: Float!) {
        T22CreateDevice(lat: $lat, lon: $lon) {
            id
            location {
                lat
                lon
            }
        }
    }
`;
