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
    mutation ($input: T22CreateDeviceInput!) {
        T22CreateDevice(input: $input) {
            device {
                id
                location {
                    lat
                    lon
                }
            }
        }
    }
`;

export const deleteDeviceMutation = gql`
    mutation ($input: T22DeleteDeviceInput!) {
        T22DeleteDevice(input: $input) {
            id
        }
    }
`;
