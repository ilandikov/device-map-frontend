import { LoginModalAction, LoginModalActionType } from './LoginModalAction';
import { AuthenticationState, buildAuthenticationState } from './AuthenticationState';
import { afterRemoteAnswer } from './AfterRemoteAnswer';
import { beforeRemoteRequest } from './BeforeRemoteRequest';
import { afterButtonClick } from './AfterButtonClick';
import { withPayload } from './WithPayload';

export function authentication(
    state: AuthenticationState = buildAuthenticationState({}),
    action: LoginModalAction,
): AuthenticationState {
    switch (action.type) {
        case LoginModalActionType.LOGIN_MODAL_INPUT:
            return { ...state, ...withPayload(action) };
        case LoginModalActionType.LOGIN_MODAL_BUTTON_CLICKED:
            return { ...state, ...afterButtonClick(action, state) };
        case LoginModalActionType.LOGIN_MODAL_REMOTE_REQUEST:
            return { ...state, ...beforeRemoteRequest(action, state) };
        case LoginModalActionType.LOGIN_MODAL_REMOTE_ANSWER:
            return { ...state, ...afterRemoteAnswer(action, state) };
        default:
            return state;
    }
}
