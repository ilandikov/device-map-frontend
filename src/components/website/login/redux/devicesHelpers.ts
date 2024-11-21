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
