import {
    LoginModalCheck,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
    loginModalRemoteRequest,
} from '../LoginModalAction';
import { AuthenticationStep } from '../AuthenticationState';
import { mapAppShowComponent } from '../../../mapApp/redux/MapAppAction';
import { cognito } from '../cognito';
import { itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { MapAppComponents } from '../../../mapApp/redux/MapAppState';
import { mapAppSetLoggedInUserID } from '../../../mapApp/redux/LoggedInUserAction';
import { cognitoRejectingClient, cognitoResolvingClient } from './cognitoTestHelpers';

describe('cognito epic tests', () => {
    [
        { stage: 'sign up', step: AuthenticationStep.PASSWORD_CREATION_LOADING },
        { stage: 'password reset', step: AuthenticationStep.PASSWORD_RESET_LOADING },
        { stage: 'sign up OTP', step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING },
        { stage: 'sign up OTP resend', step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING },
        { stage: 'forgot password', step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING },
        { stage: 'sign out', step: AuthenticationStep.LOGGED_IN },
    ].forEach(({ stage, step }) => {
        itShouldAnswerBy(`confirming ${stage}`, {
            epic: cognito,
            remoteClients: { cognitoClient: cognitoResolvingClient },
            partialRootState: { authentication: { step } },
            sentAction: loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedActions: [loginModalRemoteAnswerSuccess()],
        });

        itShouldAnswerBy(`sending error from ${stage}`, {
            epic: cognito,
            remoteClients: { cognitoClient: cognitoRejectingClient },
            partialRootState: { authentication: { step } },
            sentAction: loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedActions: [loginModalRemoteAnswerFailure('cognitoUnknownException')],
        });
    });

    itShouldAnswerBy('confirming sign in, showing device location and setting the user id', {
        epic: cognito,
        remoteClients: { cognitoClient: cognitoResolvingClient },
        partialRootState: { authentication: { step: AuthenticationStep.LOGIN_LOADING } },
        sentAction: loginModalRemoteRequest(LoginModalCheck.NONE),
        expectedActions: [
            loginModalRemoteAnswerSuccess(),
            mapAppShowComponent(MapAppComponents.DEVICE_LOCATION),
            mapAppSetLoggedInUserID('0636d777-7355-4fc4-899c-5a7268434a57'),
        ],
    });

    itShouldAnswerBy('sending error from sign in', {
        epic: cognito,
        remoteClients: { cognitoClient: cognitoRejectingClient },
        partialRootState: { authentication: { step: AuthenticationStep.LOGIN_LOADING } },
        sentAction: loginModalRemoteRequest(LoginModalCheck.NONE),
        expectedActions: [loginModalRemoteAnswerFailure('cognitoUnknownException')],
    });

    itShouldAnswerBy('doing nothing on mail input step', {
        epic: cognito,
        partialRootState: { authentication: { step: AuthenticationStep.MAIL_INPUT } },
        sentAction: loginModalRemoteRequest(LoginModalCheck.NONE),
        expectedActions: [],
    });

    Object.values(AuthenticationStep).forEach((step) => {
        itShouldAnswerBy(`doing nothing at step ${step} when there is an error`, {
            epic: cognito,
            partialRootState: { authentication: { step, error: new Error('something is wrong') } },
            sentAction: loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedActions: [],
        });
    });
});
