import { gql } from '@apollo/client';

export const listDevicesQuery = {
    query: gql`
        query {
            T22ListDevices {
                devices {
                    id
                    creatorID
                    location {
                        lat
                        lon
                    }
                    approvals
                    lastUpdate
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
                creatorID
                location {
                    lat
                    lon
                }
                approvals
                lastUpdate
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

export const approveDeviceMutation = gql`
    mutation ($input: T22ApproveDeviceInput!) {
        T22ApproveDevice(input: $input) {
            id
            lastUpdate
        }
    }
`;

export const getUserQuery = gql`
    query {
        T22GetUser {
            id
            points
        }
    }
`;

export const getAddressQuery = gql`
    query ($input: T22GetAddressInput!) {
        T22GetAddress(input: $input) {
            address {
                line1
                line2
            }
        }
    }
`;
