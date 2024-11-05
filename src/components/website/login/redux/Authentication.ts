import { LoginModalAction, LoginModalActionType } from './LoginModalAction';
import { AuthenticationState, AuthenticationStep, initialAuthenticationState } from './AuthenticationState';
import { afterRemoteAnswer } from './AfterRemoteAnswer';
import { beforeRemoteRequest } from './BeforeRemoteRequest';
import { afterButtonClick } from './AfterButtonClick';
import { withPayload } from './WithPayload';

export type StepMap = Partial<{ [key in AuthenticationStep]: AuthenticationStep }>;

export function authentication(
    state: AuthenticationState = initialAuthenticationState,
    action: LoginModalAction,
): AuthenticationState {
    switch (action.type) {
        case LoginModalActionType.INPUT:
            return { ...state, ...withPayload(action) };
        case LoginModalActionType.BUTTON_CLICKED:
            return { ...state, ...afterButtonClick(action, state) };
        case LoginModalActionType.REMOTE_REQUEST:
            return { ...state, ...beforeRemoteRequest(action, state) };
        case LoginModalActionType.REMOTE_ANSWER:
            return { ...state, ...afterRemoteAnswer(action, state) };
        default:
            return state;
    }
}
