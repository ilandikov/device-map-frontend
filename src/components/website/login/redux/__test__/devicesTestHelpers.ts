import { lastValueFrom, of, toArray } from 'rxjs';
import {
    ApolloCache,
    ApolloClient,
    ApolloLink,
    ApolloQueryResult,
    DataProxy,
    DefaultContext,
    DefaultOptions,
    DocumentNode,
    DocumentTransform,
    FetchResult,
    FragmentMatcher,
    GraphQLRequest,
    MutationOptions,
    NormalizedCacheObject,
    Observable,
    ObservableQuery,
    OperationVariables,
    QueryOptions,
    Reference,
    RefetchQueriesInclude,
    RefetchQueriesOptions,
    RefetchQueriesResult,
    Resolvers,
    SubscriptionOptions,
    WatchQueryOptions,
} from '@apollo/client';
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';
import { Dependency } from '../../../../../redux/store';
import { listDevicesQuery } from '../devicesHelpers';

export async function testDevicesEpic(sentAction: MapAppAction, expectedActions: MapAppAction[]) {
    const output$ = devices(of(sentAction), buildStateForDevicesTest(), { apolloClient: new ApolloTestClient() });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));

    expect(receivedAction).toEqual(expectedActions);
}

export class ApolloTestClient implements Dependency<ApolloClient<NormalizedCacheObject>> {
    link: ApolloLink;
    cache: ApolloCache<NormalizedCacheObject>;
    disableNetworkFetches: boolean;
    version: string;
    queryDeduplication: boolean;
    defaultOptions: DefaultOptions;
    typeDefs: string | string[] | DocumentNode | DocumentNode[];

    get documentTransform(): DocumentTransform {
        throw new Error('Method not implemented.');
    }

    stop(): void {
        throw new Error('Method not implemented.');
    }

    watchQuery<T = any, TVariables extends OperationVariables = OperationVariables>(
        options: WatchQueryOptions<TVariables, T>,
    ): ObservableQuery<T, TVariables> {
        throw new Error('Method not implemented.');
    }

    query(options: QueryOptions): Promise<ApolloQueryResult<any>> {
        if (options.query === listDevicesQuery.query) {
            return Promise.resolve({
                data: {
                    T22ListDevices: [
                        {
                            __typename: 'T22Device',
                            id: 'dev1',
                            location: {
                                __typename: 'T22Location',
                                lat: 42.85862508449081,
                                lon: 74.6085298061371,
                            },
                        },
                        {
                            __typename: 'T22Device',
                            id: 'dev2a',
                            location: {
                                __typename: 'T22Location',
                                lat: 42.85883742844907,
                                lon: 74.6039915084839,
                            },
                        },
                        {
                            __typename: 'T22Device',
                            id: 'dev2b',
                            location: {
                                __typename: 'T22Location',
                                lat: 42.85883742844907,
                                lon: 74.6039915084839,
                            },
                        },
                        {
                            __typename: 'T22Device',
                            id: 'dev2c',
                            location: {
                                __typename: 'T22Location',
                                lat: 42.85883742844907,
                                lon: 74.6039915084839,
                            },
                        },
                        {
                            __typename: 'T22Device',
                            id: 'dev2d',
                            location: {
                                __typename: 'T22Location',
                                lat: 42.85883742844907,
                                lon: 74.6039915084839,
                            },
                        },
                        {
                            __typename: 'T22Device',
                            id: 'dev3',
                            location: {
                                __typename: 'T22Location',
                                lat: 42.85610049481582,
                                lon: 74.60671663284303,
                            },
                        },
                    ],
                },
                loading: false,
                networkStatus: 7,
            });
        }

        throw new Error('Method not implemented.');
    }

    mutate<
        TData = any,
        TVariables extends OperationVariables = OperationVariables,
        TContext extends Record<string, any> = DefaultContext,
        TCache extends ApolloCache<any> = ApolloCache<any>,
    >(options: MutationOptions<TData, TVariables, TContext, ApolloCache<any>>): Promise<FetchResult<TData>> {
        throw new Error('Method not implemented.');
    }

    subscribe<T = any, TVariables extends OperationVariables = OperationVariables>(
        options: SubscriptionOptions<TVariables, T>,
    ): Observable<FetchResult<T>> {
        throw new Error('Method not implemented.');
    }

    readQuery<T = any, TVariables = OperationVariables>(
        options: DataProxy.Query<TVariables, T>,
        optimistic?: boolean,
    ): T {
        throw new Error('Method not implemented.');
    }

    readFragment<T = any, TVariables = OperationVariables>(
        options: DataProxy.Fragment<TVariables, T>,
        optimistic?: boolean,
    ): T {
        throw new Error('Method not implemented.');
    }

    writeQuery<TData = any, TVariables = OperationVariables>(
        options: DataProxy.WriteQueryOptions<TData, TVariables>,
    ): Reference {
        throw new Error('Method not implemented.');
    }

    writeFragment<TData = any, TVariables = OperationVariables>(
        options: DataProxy.WriteFragmentOptions<TData, TVariables>,
    ): Reference {
        throw new Error('Method not implemented.');
    }

    __actionHookForDevTools(cb: () => any): void {
        throw new Error('Method not implemented.');
    }

    __requestRaw(
        payload: GraphQLRequest<Record<string, any>>,
    ): Observable<ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>> {
        throw new Error('Method not implemented.');
    }

    resetStore(): Promise<ApolloQueryResult<any>[]> {
        throw new Error('Method not implemented.');
    }

    clearStore(): Promise<any[]> {
        throw new Error('Method not implemented.');
    }

    onResetStore(cb: () => Promise<any>): () => void {
        throw new Error('Method not implemented.');
    }

    onClearStore(cb: () => Promise<any>): () => void {
        throw new Error('Method not implemented.');
    }

    reFetchObservableQueries(includeStandby?: boolean): Promise<ApolloQueryResult<any>[]> {
        throw new Error('Method not implemented.');
    }

    refetchQueries<
        TCache extends ApolloCache<any> = ApolloCache<NormalizedCacheObject>,
        TResult = Promise<ApolloQueryResult<any>>,
    >(options: RefetchQueriesOptions<TCache, TResult>): RefetchQueriesResult<TResult> {
        throw new Error('Method not implemented.');
    }

    getObservableQueries(include?: RefetchQueriesInclude): Map<string, ObservableQuery<any, OperationVariables>> {
        throw new Error('Method not implemented.');
    }

    extract(optimistic?: boolean): NormalizedCacheObject {
        throw new Error('Method not implemented.');
    }

    restore(serializedState: NormalizedCacheObject): ApolloCache<NormalizedCacheObject> {
        throw new Error('Method not implemented.');
    }

    addResolvers(resolvers: Resolvers | Resolvers[]): void {
        throw new Error('Method not implemented.');
    }

    setResolvers(resolvers: Resolvers | Resolvers[]): void {
        throw new Error('Method not implemented.');
    }

    getResolvers(): Resolvers {
        throw new Error('Method not implemented.');
    }

    setLocalStateFragmentMatcher(fragmentMatcher: FragmentMatcher): void {
        throw new Error('Method not implemented.');
    }

    setLink(newLink: ApolloLink): void {
        throw new Error('Method not implemented.');
    }
}
