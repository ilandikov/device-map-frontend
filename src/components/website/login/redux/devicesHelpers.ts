import { gql } from '@apollo/client';

export const listDevicesQuery = {
    query: gql`
        query {
            T22ListDevices {
                devices {
                    id
                    location {
                        lat
                        lon
                    }
                }
                count
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
