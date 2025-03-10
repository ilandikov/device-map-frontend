import { DocumentNode, gql } from '@apollo/client';
import { Mutation } from '@mancho-school-t22/graphql-types';
import { setAuthenticatedClient } from './graphql';

export async function mutateAsAuthUser<TInput, TResponse>(
    input: TInput,
    mutation: DocumentNode,
    resolver: keyof Mutation,
) {
    return (await setAuthenticatedClient())
        .mutate<Mutation>({
            mutation,
            variables: { input },
        })
        .then((response) => response.data[resolver] as TResponse);
}

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
                createdDate
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

export const onDeviceCreationSubscription = gql`
    subscription ($creatorID: ID!) {
        T22OnDeviceCreation2(creatorID: $creatorID) {
            id
            creatorID
            location {
                lat
                lon
            }
            approvals
            createdDate
            lastUpdate
        }
    }
`;

export const getUserQuery = gql`
    query {
        T22GetUser {
            user {
                id
                points
            }
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
