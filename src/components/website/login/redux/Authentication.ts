import { LoginModalAction, LoginModalActionType } from './LoginModalAction';
import { AuthenticationState, AuthenticationStep, initialAuthenticationState } from './AuthenticationState';
import { withRemoteAnswer } from './WithRemoteAnswer';
import { afterRemoteRequest } from './AfterRemoteRequest';
import { afterButtonClick } from './AfterButtonClick';
import { withPayload } from './WithPayload';

export type StepMap = Partial<{ [key in AuthenticationStep]: AuthenticationStep }>;

export function authentication(
    state: AuthenticationState = initialAuthenticationState,
    action: LoginModalAction,
): AuthenticationState {
    switch (action.type) {
        case LoginModalActionType.REMOTE_ANSWER:
            return { ...state, ...withRemoteAnswer(action, state) };
        case LoginModalActionType.INPUT: {
            return { ...state, ...withPayload(action) };
        }
        case LoginModalActionType.REMOTE_REQUEST: {
            return { ...state, ...afterRemoteRequest(action, state) };
        }
        case LoginModalActionType.BUTTON_CLICKED:
            return { ...state, ...afterButtonClick(action, state) };
    }
    return state;
}
