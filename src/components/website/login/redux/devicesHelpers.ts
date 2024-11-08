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
