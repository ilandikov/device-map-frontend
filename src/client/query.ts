import { DocumentNode, gql } from '@apollo/client';
import { Mutation, Subscription, T22Device } from '@mancho-school-t22/graphql-types';
import { Subscriber } from 'rxjs';
import { anonymousClient, setAuthenticatedClient } from './graphql';

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

export function subscribeAsAuthUser<TVariables>(variables: TVariables, query: DocumentNode) {
    return (subscriber: Subscriber<T22Device>) => {
        const subscription = anonymousClient.subscribe<Subscription, TVariables>({ query, variables }).subscribe({
            next: (fetchResult) => {
                subscriber.next(fetchResult.data.T22NotifyDeviceCreation);
                subscriber.complete();
            },
            error: (error) => {
                subscriber.error(error);
                subscriber.complete();
            },
            complete: () => subscriber.complete(),
        });
        return () => subscription.unsubscribe();
    };
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
    mutation ($input: T22CreateDeviceRequestInput!) {
        T22CreateDeviceRequest(input: $input) {
            id
        }
    }
`;

export const deleteDeviceMutation = gql`
    mutation ($input: T22DeleteDeviceRequestInput!) {
        T22DeleteDeviceRequest(input: $input) {
            id
        }
    }
`;

export const approveDeviceMutation = gql`
    mutation ($input: T22ApproveDeviceRequestInput!) {
        T22ApproveDeviceRequest(input: $input) {
            id
        }
    }
`;

export const notifyDeviceCreationSubscription = gql`
    subscription ($creatorID: ID!) {
        T22NotifyDeviceCreation(creatorID: $creatorID) {
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

export const notifyUserUpdateSubscription = gql`
    subscription ($id: ID!) {
        T22NotifyUserUpdate(id: $id) {
            id
            points
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
