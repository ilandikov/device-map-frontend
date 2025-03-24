import { ApolloClient, ApolloLink, DocumentNode, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';
import { Mutation, Query, Subscription } from '@mancho-school-t22/graphql-types';
import { Subscriber } from 'rxjs';
import { AUTH_TYPE, createAuthLink } from 'aws-appsync-auth-link';
import { createHttpLink } from '@apollo/client/core';
import { anonymousClient, setAuthenticatedClient } from './graphql';

const anonymousUserClient1 = new ApolloClient({
    link: ApolloLink.from([
        createAuthLink({
            url: process.env.GATSBY_APPSYNC_ENDPOINT,
            region: process.env.GATSBY_REGION,
            auth: {
                type: AUTH_TYPE.API_KEY,
                apiKey: process.env.GATSBY_X_API_KEY,
            },
        }),
        createHttpLink({
            uri: process.env.GATSBY_APPSYNC_ENDPOINT,
        }),
    ]),
    cache: new InMemoryCache({ addTypename: false }),
});

export async function queryAsAnonymousUser<TInput, TResponse>(
    _anonymousUserClient: ApolloClient<NormalizedCacheObject>,
    input: TInput,
    query: DocumentNode,
    resolver: keyof Query,
) {
    const response = await anonymousUserClient1.query<Query>({ query, variables: { input } });
    return response.data[resolver] as TResponse;
}

export async function mutateAsAuthUser<TInput, TResponse>({
    input,
    mutation,
    resolver,
}: {
    input: TInput;
    mutation: DocumentNode;
    resolver: keyof Mutation;
}) {
    return (await setAuthenticatedClient())
        .mutate<Mutation>({
            mutation,
            variables: { input },
        })
        .then((response) => response.data[resolver] as TResponse);
}

export function subscribeAsAuthUser<TVariables, TResponse>({
    variables,
    query,
    resolver,
    closeAfterFirstAnswer,
}: {
    variables: TVariables;
    query: DocumentNode;
    resolver: keyof Subscription;
    closeAfterFirstAnswer: boolean;
}) {
    return (subscriber: Subscriber<TResponse>) => {
        const subscription = anonymousClient.subscribe<Subscription, TVariables>({ query, variables }).subscribe({
            next: (fetchResult) => {
                subscriber.next(fetchResult.data[resolver] as TResponse);
                if (closeAfterFirstAnswer) {
                    subscriber.complete();
                }
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
