import { lastValueFrom, of, toArray } from 'rxjs';
import { LoginModalAction, LoginModalRemoteRequest } from '../LoginModalAction';
import { LoginModalAuthenticationState } from '../LoginModalAuthenticationState';
import { cognito } from '../cognito';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';

class cognitoTestClient {
    private readonly _mockedResult: Promise<void>;

    constructor(mockedResult: Promise<void>) {
        this._mockedResult = mockedResult;
    }

    signUp() {
        return this._mockedResult;
    }

    signUpConfirmCode() {
        return this._mockedResult;
    }

    confirmPassword() {
        return this._mockedResult;
    }

    signIn() {
        return this._mockedResult;
    }

    forgotPassword() {
        return this._mockedResult;
    }

    signOut() {
        return this._mockedResult;
    }
}

export async function verifyCognitoEpicAction(
    sentAction: LoginModalRemoteRequest,
    initialState: LoginModalAuthenticationState,
    remoteServiceAnswer: Promise<any>,
    expectedActions: (LoginModalAction | MapAppAction)[],
) {
    const output$ = cognito(
        of(sentAction),
        {
            value: {
                loginModalAuthentication: initialState,
            },
        },
        {
            cognitoClient: new cognitoTestClient(remoteServiceAnswer),
        },
    );
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}

export async function verifyCognitoEpicNoAction(
    sentAction: LoginModalRemoteRequest,
    initialState: LoginModalAuthenticationState,
) {
    const output$ = cognito(
        of(sentAction),
        {
            value: {
                loginModalAuthentication: initialState,
            },
        },
        { cognitoClient: {} },
    );
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual([]);
}

export const cognitoSignUpResult = {
    user: {
        username: '3kr4i6ngfa@mailcurity.com',
        pool: {
            userPoolId: 'us-west-2_Vks7GkhlO',
            clientId: '7nm1627efll9vkbn9dnqhimp4g',
            client: {
                endpoint: 'https://cognito-idp.us-west-2.amazonaws.com/',
                fetchOptions: {},
            },
            advancedSecurityDataCollectionFlag: true,
            storage: {},
        },
        Session: null,
        client: {
            endpoint: 'https://cognito-idp.us-west-2.amazonaws.com/',
            fetchOptions: {},
        },
        signInUserSession: null,
        authenticationFlowType: 'USER_SRP_AUTH',
        storage: {},
        keyPrefix: 'CognitoIdentityServiceProvider.7nm1627efll9vkbn9dnqhimp4g',
        userDataKey: 'CognitoIdentityServiceProvider.7nm1627efll9vkbn9dnqhimp4g.3kr4i6ngfa@mailcurity.com.userData',
    },
    userConfirmed: false,
    userSub: 'd726792b-41af-4091-8877-302f5f9d31e9',
    codeDeliveryDetails: {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: '3***@m***',
    },
};

export const cognitoPasswordResetConfirmationResult = {
    CodeDeliveryDetails: {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: '3***@m***',
    },
};

export const cognitoSignUpConfirmationResult = 'SUCCESS';
