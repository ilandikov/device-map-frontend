import { authentication } from '../Authentication';
import {
    LoginModalAction,
    LoginModalButton,
    LoginModalCheck,
    LoginModalInputType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
    loginModalRemoteRequest,
} from '../LoginModalAction';
import {
    AuthenticationState,
    AuthenticationStep,
    buildAuthenticationState,
    initialAuthenticationState,
} from '../AuthenticationState';
import { CognitoErrors } from '../cognitoHelpers';
import { MailInputError, OTPError, PasswordError } from '../AuthenticationErrors';

function testStateChange(
    initialState: Partial<AuthenticationState>,
    action: LoginModalAction,
    expectedChange: Partial<AuthenticationState>,
) {
    const nextState = authentication(buildAuthenticationState(initialState), action);

    const expectedState: AuthenticationState = {
        ...buildAuthenticationState(initialState),
        ...expectedChange,
    };
    expect(nextState).toEqual(expectedState);
}

describe('LoginModal reducer tests', () => {
    it('should match the initial state', () => {
        expect(initialAuthenticationState).toMatchObject<AuthenticationState>({
            step: AuthenticationStep.WELCOME,
            email: '',
            error: null,
            password: '',
            passwordRepeat: '',
            OTP: '',
        });
    });

    it('should not change the initial state on a dummy action', () => {
        // @ts-expect-error
        testStateChange(initialAuthenticationState, { type: 'DUMMY_ACTION' }, {});
    });

    it('any input shall reset the error', () => {
        const initialState = buildAuthenticationState({ error: new Error('shouldDisappear') });
        // @ts-expect-error
        const action = loginModalInput('wrongType', '');

        testStateChange(initialState, action, {
            error: null,
        });
    });
});

describe('welcome screen buttons', () => {
    it('should transition to email input', () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.WELCOME });
        const action = loginModalButtonClick(LoginModalButton.ACCOUNT_REGISTER);

        testStateChange(initialState, action, {
            step: AuthenticationStep.MAIL_INPUT,
        });
    });

    it('should transition to user login', () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.WELCOME });
        const action = loginModalButtonClick(LoginModalButton.ACCOUNT_LOGIN);

        testStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
        });
    });
});

describe('navigation logic', () => {
    it('cancel button: should reset the state back to initial', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
            email: 'something@somewhere.com',
            error: new Error('whack'),
            password: 'authMePls',
            passwordRepeat: 'authMePls',
            OTP: '654342',
        });
        const action = loginModalButtonClick(LoginModalButton.CANCEL);

        testStateChange(initialState, action, {
            step: AuthenticationStep.WELCOME,
            email: '',
            error: null,
            password: '',
            passwordRepeat: '',
            OTP: '',
        });
    });

    it.each([
        // From mail input to welcome
        [AuthenticationStep.MAIL_INPUT, AuthenticationStep.WELCOME],

        // From password input to welcome
        [AuthenticationStep.LOGIN, AuthenticationStep.WELCOME],

        // From password reset to login
        [AuthenticationStep.PASSWORD_RESET_REQUEST, AuthenticationStep.LOGIN],

        // From password creation to mail input
        [AuthenticationStep.PASSWORD_CREATION, AuthenticationStep.MAIL_INPUT],
    ])('go back button: should transition from %s to %s', (initialStep, stepAfterGoBack) => {
        const initialState = buildAuthenticationState({ step: initialStep });
        const action = loginModalButtonClick(LoginModalButton.GO_BACK);

        testStateChange(initialState, action, {
            step: stepAfterGoBack,
        });
    });
});

describe('email input logic', () => {
    it('should update user email', () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.MAIL_INPUT });
        const action = loginModalInput(LoginModalInputType.EMAIL, 'myMail@myServer.xyz');

        testStateChange(initialState, action, {
            email: 'myMail@myServer.xyz',
        });
    });

    it('should remove mail error and transition to password creation after good mail has been sent to verification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'good@email.com',
            error: new Error('omgSomethingIsWrong'),
        });
        const action = loginModalRemoteRequest(LoginModalCheck.USERNAME);

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION,
            error: null,
        });
    });

    it('should set mail error and stay at mail input when bad mail has been sent to verification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'this is not an email!',
        });
        const action = loginModalRemoteRequest(LoginModalCheck.USERNAME);

        testStateChange(initialState, action, { error: new Error(MailInputError.NOT_VALID) });
    });

    it('should remove mail error and transition to login with an existing mail', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'already@exists.com',
            error: new Error(CognitoErrors.USERNAME_EXISTS),
        });
        const action = loginModalButtonClick(LoginModalButton.ACCOUNT_LOGIN);

        testStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
            error: null,
        });
    });
});

describe('user password logic', () => {
    it('should set user password', () => {
        const initialState = buildAuthenticationState({});

        const action = loginModalInput(LoginModalInputType.PASSWORD, 'haha!!11');

        testStateChange(initialState, action, {
            password: 'haha!!11',
        });
    });

    it('should set user password repeat', () => {
        const initialState = buildAuthenticationState({});

        const action = loginModalInput(LoginModalInputType.PASSWORD_REPEAT, 'lmao!rofl!');

        testStateChange(initialState, action, {
            passwordRepeat: 'lmao!rofl!',
        });
    });

    it('should transition to loading step after password creation if passwords are matching and remove password error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION,
            password: 'passwordsMatchAndAreStrong9%',
            passwordRepeat: 'passwordsMatchAndAreStrong9%',
            error: new Error('thisIsSoWrong'),
        });

        const action = loginModalRemoteRequest(LoginModalCheck.PASSWORD);

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            error: null,
        });
    });

    it('should transition to loading after password reset if passwords are matching and remove password error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET,
            password: '1!veryGoodPassword',
            passwordRepeat: '1!veryGoodPassword',
            error: new Error('shouldNotHappen'),
        });

        const action = loginModalRemoteRequest(LoginModalCheck.PASSWORD);

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
            error: null,
        });
    });

    it('should set password error if passwords are not matching', () => {
        const initialState = buildAuthenticationState({
            password: 'dontMatch',
            passwordRepeat: 'likeForSureDontMatch',
        });

        const action = loginModalRemoteRequest(LoginModalCheck.PASSWORD);

        testStateChange(initialState, action, {
            error: new Error(PasswordError.NOT_MATCHING),
        });
    });
});

describe('sign up logic', () => {
    it('should transition to OTP input if sign up succeeded', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_LOADING,
        });
        const action = loginModalRemoteAnswerSuccess();

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
        });
    });

    it('should transition to mail input if sign up failed', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            error: null,
        });
        const action = loginModalRemoteAnswerFailure('thisIsWhy');

        testStateChange(initialState, action, {
            step: AuthenticationStep.MAIL_INPUT,
            error: new Error('thisIsWhy'),
        });
    });
});

describe('sign up OTP logic', () => {
    it('should move from sign up OTP to sign up OTP loading stage and reset the error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
            OTP: '451035',
            error: new Error('something is wrong with OTP'),
        });
        const action = loginModalRemoteRequest(LoginModalCheck.OTP);

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
            error: null,
        });
    });

    it('should move from password reset OTP to new password input step and reset the error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP,
            OTP: '781340',
            error: new Error('verifyTheCodeAgain'),
        });
        const action = loginModalRemoteRequest(LoginModalCheck.OTP);

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET,
            error: null,
        });
    });

    it('should set OTP value in the state', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP,
        });
        const action = loginModalInput(LoginModalInputType.OTP, '9832');

        testStateChange(initialState, action, {
            OTP: '9832',
        });
    });

    it('should set error if OTP is less than 6 characters', () => {
        const initialState = buildAuthenticationState({
            OTP: '51094',
        });
        const action = loginModalRemoteRequest(LoginModalCheck.OTP);

        testStateChange(initialState, action, {
            error: new Error(OTPError.TOO_SHORT),
        });
    });

    it('should transition to login after sign up has been confirmed', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const action = loginModalRemoteAnswerSuccess();

        testStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
        });
    });

    it('should transition back to OTP input if a sign up confirmation failed and set an error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const action = loginModalRemoteAnswerFailure('signUpWasNotConfirmedUnfortunately');

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
            error: new Error('signUpWasNotConfirmedUnfortunately'),
        });
    });
});

describe('login logic', () => {
    it('should transition to loading state on user and password verify request, reset error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGIN,
            error: new Error('userNameAndPasswordAreWrong!'),
        });
        const action = loginModalRemoteRequest(LoginModalCheck.NONE);

        testStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN_LOADING,
            error: null,
        });
    });

    it('should transition from login to password reset state on password reset button click, keep the mail, reset the password and the error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGIN,
            email: 'writeMe@mail.com',
            password: 'iForgot',
            error: new Error('triedToInputPasswordButFailed'),
        });
        const action = loginModalButtonClick(LoginModalButton.RESET_PASSWORD);

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            password: '',
            error: null,
        });
    });

    it('should transition from loading state to logged in on login success notification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGIN_LOADING,
        });
        const action = loginModalRemoteAnswerSuccess();

        testStateChange(initialState, action, {
            step: AuthenticationStep.LOGGED_IN,
        });
    });

    it('should transition from loading state back to login step on login failure notification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGIN_LOADING,
        });
        const action = loginModalRemoteAnswerFailure('thereHasBeenAnError');

        testStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
            error: new Error('thereHasBeenAnError'),
        });
    });
});

describe('password reset logic', () => {
    it('should transition to loading step and reset error on mail verify request with a valid email', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            email: 'valid@mail.com',
            error: new Error(MailInputError.NOT_VALID),
        });
        const action = loginModalRemoteRequest(LoginModalCheck.USERNAME);

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING,
            error: null,
        });
    });

    it('should set mail error when a bad email has been set on verification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            email: '!notAMail',
        });
        const action = loginModalRemoteRequest(LoginModalCheck.USERNAME);

        testStateChange(initialState, action, {
            error: new Error(MailInputError.NOT_VALID),
        });
    });

    it('should transition back to password reset OTP input and show error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const action = loginModalRemoteAnswerFailure('thereHasBeenAnError');

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_OTP,
            error: new Error('thereHasBeenAnError'),
        });
    });

    it('should transition to login after password has been reset successfully', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const action = loginModalRemoteAnswerSuccess();

        testStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
        });
    });

    it('should go back to OTP input when password has not been reset successfully', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const action = loginModalRemoteAnswerFailure('thisCouldNotGoWorseThanThat');

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_OTP,
            error: new Error('thisCouldNotGoWorseThanThat'),
        });
    });

    it('should advance to OTP request', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING,
        });

        const action = loginModalRemoteAnswerSuccess();

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_OTP,
        });
    });

    it('should fallback to reset request form', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING,
        });

        const action = loginModalRemoteAnswerFailure('couldNotRequest');

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            error: new Error('couldNotRequest'),
        });
    });
});

describe('OTP code resend logic', () => {
    it('should reset the error when OTP is sent again', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
            error: new Error('thisShouldDisappear'),
        });
        const action = loginModalRemoteRequest(LoginModalCheck.NONE);

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING,
            error: null,
        });
    });

    it('should move to OTP input after OTP has been resent', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING,
        });
        const action = loginModalRemoteAnswerSuccess();

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
        });
    });

    it('should move to OTP input after OTP could not have been resent', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING,
        });
        const action = loginModalRemoteAnswerFailure('couldNotResendOTP');

        testStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
            error: new Error('couldNotResendOTP'),
        });
    });
});

describe('logout logic', () => {
    it('should reset the whole state on user button click', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGGED_IN,
            email: 'reset@me.com',
            error: new Error('meToo!'),
            password: 'andMe',
            passwordRepeat: 'thisAsWell',
            OTP: '457674',
        });
        const action = loginModalButtonClick(LoginModalButton.USER_BUTTON);

        testStateChange(initialState, action, initialAuthenticationState);
    });
});
