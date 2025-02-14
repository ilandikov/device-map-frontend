import { lastValueFrom, of, toArray } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { LoginModalAction, LoginModalCheck, loginModalRemoteRequest } from '../LoginModalAction';
import { AuthenticationState } from '../AuthenticationState';
import { cognito } from '../cognito';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { buildTestStateObservable } from '../../../../../redux/__mocks__/stateBuilders';
import { ClassToInterface } from '../../../../../redux/store';

export enum TestClient {
    RESOLVING = 'RESOLVING',
    REJECTING = 'REJECTING',
}

const cognitoResolvingTestClient: ClassToInterface<CognitoClient> = {
    signUp: () => Promise.resolve(cognitoSignUpRequestResult as any),
    signUpConfirmCode: () => Promise.resolve(cognitoSignUpConfirmationResult),
    signIn: () => Promise.resolve(cognitoSignInResult as any),
    forgotPassword: () => Promise.resolve(cognitoPasswordResetRequestResult),
    confirmPassword: () => Promise.resolve(cognitoPasswordResetConfirmationResult),
    resendConfirmCode: () => Promise.resolve({} as any),
    signOut: () => Promise.resolve(cognitoSignOutResult),
};

const cognitoRejectingTestClient: ClassToInterface<CognitoClient> = {
    signUp: () => Promise.reject(),
    signUpConfirmCode: () => Promise.reject(),
    signIn: () => Promise.reject(),
    forgotPassword: () => Promise.reject(),
    confirmPassword: () => Promise.reject(),
    resendConfirmCode: () => Promise.reject(),
    signOut: () => Promise.reject(),
};

export async function testCognitoOutputAction(
    initialState: Partial<AuthenticationState>,
    testClient: TestClient,
    expectedActions: (LoginModalAction | MapAppAction)[],
) {
    const stateForTest = buildTestStateObservable({ authentication: initialState });
    const dependencies = {
        cognitoClient: testClient === TestClient.RESOLVING ? cognitoResolvingTestClient : cognitoRejectingTestClient,
    };

    const action = of(loginModalRemoteRequest(LoginModalCheck.NONE));
    const output$ = cognito(action, stateForTest, dependencies);

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}

export async function testCognitoNoOutput(initialState: Partial<AuthenticationState>) {
    const stateForTest = buildTestStateObservable({ authentication: initialState });

    const action = of(loginModalRemoteRequest(LoginModalCheck.NONE));
    const output$ = cognito(action, stateForTest, {});

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual([]);
}

export const cognitoSignUpRequestResult = {
    user: {
        username: '58vr7gv41m@mailcurity.com',
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
        userDataKey: 'CognitoIdentityServiceProvider.7nm1627efll9vkbn9dnqhimp4g.58vr7gv41m@mailcurity.com.userData',
    },
    userConfirmed: false,
    userSub: '3a2d8c52-ade3-468e-a9cb-88c82420dd7d',
    codeDeliveryDetails: {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: '5***@m***',
    },
};

export const cognitoPasswordResetRequestResult = {
    CodeDeliveryDetails: {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: '3***@m***',
    },
};

export const cognitoSignUpConfirmationResult = 'SUCCESS';

export const cognitoPasswordResetConfirmationResult = 'SUCCESS';

export const cognitoSignInResult = {
    session: {
        idToken: {
            jwtToken:
                'eyJraWQiOiJJZU10NmRNTDNHYW9Vb1ByNVhwQ3M4S1R0NEc3NktScndcL2dkaFB0Z0J0TT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwNjM2ZDc3Ny03MzU1LTRmYzQtODk5Yy01YTcyNjg0MzRhNTciLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnByZWZlcnJlZF9yb2xlIjoiYXJuOmF3czppYW06Ojk5NjgxODc1NzE4Mzpyb2xlXC9iZXRhVXNlciIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX1ZrczdHa2hsTyIsImNvZ25pdG86dXNlcm5hbWUiOiIwNjM2ZDc3Ny03MzU1LTRmYzQtODk5Yy01YTcyNjg0MzRhNTciLCJvcmlnaW5fanRpIjoiNWI4NGEwOWQtNzExYi00NWM3LWFjMDMtNzI2YzIwMTNhZDBkIiwiY29nbml0bzpyb2xlcyI6WyJhcm46YXdzOmlhbTo6OTk2ODE4NzU3MTgzOnJvbGVcL2JldGFVc2VyIl0sImF1ZCI6IjdubTE2MjdlZmxsOXZrYm45ZG5xaGltcDRnIiwiZXZlbnRfaWQiOiI4NzgxYzkwOC05M2Q3LTQwZDYtYTYzZC05NTkyOTFlZTNkMTciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxMzUzODMzMCwiZXhwIjoxNzEzNTQxOTMwLCJpYXQiOjE3MTM1MzgzMzAsImp0aSI6IjBiNGI3ODM4LTZmYzgtNDNiNi04MWUxLTA5NjhmZTU5NzUxMiIsImVtYWlsIjoiNTh2cjdndjQxbUBtYWlsY3VyaXR5LmNvbSJ9.t-3sqqE7c8Zup2LDMlro-ich7bMdwpOF7FnTnMvDjc7uvnXCnwwn97A1k0oOw_Y2g6itQkZzCzp4wPczq_4qlmQXRs7UsuG4Hr0Thb6foBkJXovi2DKWkklrVjXR19R_1iXorHx5iQ73SMIQ4ugU1WZBCDarXY6aFfvojGwx-Xsgg2iOn4wsWd-rURCf1dm6J-JP7sxKMw84HMkvpUHbohdeuIXX5VsTG2Lwy8SMl7VCzh4EDWCPhiHH1VamvMvlJnSiNgLtQ-y8YatDmexnWhyd3bW1ub4741A2RuFlq9qTgxpH5woJyEZLYyzgHGxDYK_3jKCh6fDC4vxTED8DOA',
            payload: {
                sub: '0636d777-7355-4fc4-899c-5a7268434a57',
                'cognito:groups': ['User'],
                email_verified: true,
                'cognito:preferred_role': 'arn:aws:iam::996818757183:role/betaUser',
                iss: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_Vks7GkhlO',
                'cognito:username': '0636d777-7355-4fc4-899c-5a7268434a57',
                origin_jti: '5b84a09d-711b-45c7-ac03-726c2013ad0d',
                'cognito:roles': ['arn:aws:iam::996818757183:role/betaUser'],
                aud: '7nm1627efll9vkbn9dnqhimp4g',
                event_id: '8781c908-93d7-40d6-a63d-959291ee3d17',
                token_use: 'id',
                auth_time: 1713538330,
                exp: 1713541930,
                iat: 1713538330,
                jti: '0b4b7838-6fc8-43b6-81e1-0968fe597512',
                email: '58vr7gv41m@mailcurity.com',
            },
        },
        refreshToken: {
            token: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.jWj-wmlnr5tLy5px2WyFAUGEf2hfw2HDzqq3AnL96fw3pjzjhpik6IUHcXy2ak-wfSJ1MgVntjms81y_qR0oNood5UVDEYrupO3wDBgOPQjUGoos6-1VnTJqyFtqSeXP1Bd6J1bocmlAkclf1I3PZjQlBnhxzb12LVPRhxqtFqfod06xC-CE-gd2BnvMxdUMF7Nn1Tg5fzRNuj8O-_UqA-BbmNIlC_h5Okijtl3NTJHWIWs3mh5SNdpXhpqMP0E2RZUgZswpQtKIcDvkf0udX7QAeYdOsaauAGnRrKAsbpDBZTguXlf1wK_T0wVjZncwIlC3pPeiK-UTNrtyNcV3iw.wd4M6UJehxtWuSmk.Q6pzzKKTR8RcaM4uY0vf4dGJl06yvPbOQyTxPs0rIb6YAkjJrr1_aVDP_zvopgHoMf0fbfnqhsB3BvulgxKqgDoyH5GsjqBK3_0Oh8f_pyOgYxTDIQakKqvBAJeeCjrPSmHtAtdXgaacS0moVP6NdTL-H0Mkkvc1Zan-ECCFQCFBP2MrUcMuFLpBPHoxrAOagQADbM2bydMOdS3SBDVrHU77bSFMkUsGyQsV0pImlonG9YORjPbfSlBztfNeYtnw_nhfVAsNDLypg2a1Jz8lJvMffCL1_qk0tbMAi4Koc07SZw1giYdQsf-JF11aySjixFBzu5p3lpKG-DLaFbatrUJa1yKmO79RWhPILLKzTIa-L8K_ztL4gdXSqpDjaM4zVJaT8_jf7-ILBlo-ORtSg-vImU-CwvvyhSokVXgO8k5uLb1Y6m5RcpP397A3FMykIDizjxgM-e5U2xKLEisMWd2LexzY7lfDJdoE4lIhiuHOVD7UPlB5iBYKqy9q9OZxH6NJjkdwpx5NpirciunZeLbSyJmeyabB--ywLNBrWaFaGc2wjoHs0aGjGwvHRSQGI4KdXUt7yW2vHl1RzQFMMWVgK3I4qXpvOtZYfD8XktX8sBZHGVCdVz4n9OwYJvGFROyGX4Szuiffk5PUqXsBxvXF5cIVD2ZnGze9W8ww0BUjM_rSqzSZjA9LF7PP-eWHAFOw9ei8OueuuM6Ma3N810R9dv-O2vzZC2lGEDjXdiLNExBrmJvGcyB6iWm_QWKuA14w_NhpjfBYai1YzCwOGDGSxBgxgyNL7_uLfyKxlAhY8w1-IvANTwdOxgKN2jOKKc-E_jSMbipbEv4qeFI8AGYXL5Tm02tN_28TAgXWuHAY2s1Yp6MzcJX4rSPlB5dVtg5Qzp6SnPi_XTZBiuXQkeedJ6zbj0sEVnqqKs7p5ZgOtfcVaPfsaEZGLpWQg8TtZBUWI3SMhgqNbQEmyFcFBQ4Lgi8oQxv0emXEHc9BvuVoDiM86UuTBUDZ5ZGPjDfcLjxk3vobzUBXaSiHVByhisw_zekrmqHU0YnX4Phi9-40ZJxxjr93qlKb_6chue30OtcaVY-jjK7ep0ZfU5ssM0665Ifhg-tAejyM8FvoEUFsqru1ZmG1mOxbeNU2nYuS-pTr6nNrWpbzoh7uEX-9-o2foESa5MH5uaV0ikGrP4kfZ0oPRzZVggL2YEHi_cUIIoroW2thVAfvnq6eePvPkOMBAramxmn169WCVREO0hhkAPN9iPagqOwnS_vO9-Kk6gbLRWW1PBU6apazv5JnOJHthZ-3lFB2AQ9ZkzEsdgdHX2sVOQmsU8Rxxg.MprCJj1PqDQ0FWf2OMdONw',
        },
        accessToken: {
            jwtToken:
                'eyJraWQiOiJKek9XNUhnMXE3Y09sb3VWcGM0SldmcFwvRndHbjFMR3liK0taSENnMVcrVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwNjM2ZDc3Ny03MzU1LTRmYzQtODk5Yy01YTcyNjg0MzRhNTciLCJjb2duaXRvOmdyb3VwcyI6WyJVc2VyIl0sImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX1ZrczdHa2hsTyIsImNsaWVudF9pZCI6IjdubTE2MjdlZmxsOXZrYm45ZG5xaGltcDRnIiwib3JpZ2luX2p0aSI6IjViODRhMDlkLTcxMWItNDVjNy1hYzAzLTcyNmMyMDEzYWQwZCIsImV2ZW50X2lkIjoiODc4MWM5MDgtOTNkNy00MGQ2LWE2M2QtOTU5MjkxZWUzZDE3IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTcxMzUzODMzMCwiZXhwIjoxNzEzNTM4NjMwLCJpYXQiOjE3MTM1MzgzMzAsImp0aSI6IjBmODI5OTM4LWIyYjMtNGM4YS04YTk4LTc4MWI2MWU1Y2M2NyIsInVzZXJuYW1lIjoiMDYzNmQ3NzctNzM1NS00ZmM0LTg5OWMtNWE3MjY4NDM0YTU3In0.j80h7UpBG7jj7SkSlTYyoBOVRdWNiIEV2dUnxj1Ge0Y38tRjSu4XF_vggBJaQ5Yiur9bdKTC3JtZ939QBX88La2er-yzfYgolOPc51fRnXgwayTl1DatB-_j6qIP61-fGFEc2AwXPJMjdZGuPb8cd6RTFivf5cbEUJ6-T2kXZFGi52PsouBO-onbTstmYp8XOhrdrhNvx4fW21AnU_TnnsYsrySOOMaR2BT-VxUQUCe1D-7b1GafXBf1_qd-d2Wsyfc_BKMGS2fJJam_YbTC0XwNxmzmArREDB9OasEcYcCf-HrU4KQHGW_cSUGJai7l1NF-YZa7TY6tpK1NtGzF1A',
            payload: {
                sub: '0636d777-7355-4fc4-899c-5a7268434a57',
                'cognito:groups': ['User'],
                iss: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_Vks7GkhlO',
                client_id: '7nm1627efll9vkbn9dnqhimp4g',
                origin_jti: '5b84a09d-711b-45c7-ac03-726c2013ad0d',
                event_id: '8781c908-93d7-40d6-a63d-959291ee3d17',
                token_use: 'access',
                scope: 'aws.cognito.signin.user.admin',
                auth_time: 1713538330,
                exp: 1713538630,
                iat: 1713538330,
                jti: '0f829938-b2b3-4c8a-8a98-781b61e5cc67',
                username: '0636d777-7355-4fc4-899c-5a7268434a57',
            },
        },
        clockDrift: 0,
    },
};

export const cognitoSignOutResult = undefined;
