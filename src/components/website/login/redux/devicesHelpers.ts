import { gql } from '@apollo/client';
import { T22Device } from '@mancho-school-t22/graphql-types';

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

export interface T22ListDevicesResponse {
    T22ListDevices: T22Device[];
}
