import { gql } from '@apollo/client';

export const listDevicesQuery = {
    query: gql`
        query T22ListDevices {
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

export interface T22Device {
    __typename: string;
    location: { __typename: string; lon: number; lat: number };
    id: string;
}

export interface T22ListDevicesResponse {
    T22ListDevices: T22Device[];
}
