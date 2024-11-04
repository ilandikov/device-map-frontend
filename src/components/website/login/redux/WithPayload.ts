import { LoginModalInput, LoginModalInputType } from './LoginModalAction';
import { AuthenticationState } from './AuthenticationState';

export function withPayload(action: LoginModalInput): Partial<AuthenticationState> {
    const input = action.input;
    const stateKey = stateKeyToUpdateWithPayload[input.type];
    return stateKey ? { error: null, ...{ [stateKey]: input.payload } } : { error: null };
}

const stateKeyToUpdateWithPayload: { [key in LoginModalInputType]: keyof AuthenticationState } = {
    EMAIL: 'email',
    PASSWORD: 'password',
    PASSWORD_REPEAT: 'passwordRepeat',
    OTP: 'OTP',
};
