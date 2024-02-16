export let setUserAuthState: jest.Mock;
export let setUserEmail: jest.Mock;
export let setUserPassword: jest.Mock;
export let setUserPasswordRepeat: jest.Mock;

export function resetHookMocks() {
    const hooks = {
        setUserAuthState: jest.fn().mockImplementation((userAuthState) => userAuthState),
        setUserEmail: jest.fn().mockImplementation((userEmail) => userEmail),
        setUserPassword: jest.fn().mockImplementation((userEmail) => userEmail),
        setUserPasswordRepeat: jest.fn().mockImplementation((userEmail) => userEmail),
    };
    setUserAuthState = hooks.setUserAuthState;
    setUserEmail = hooks.setUserEmail;
    setUserPassword = hooks.setUserPassword;
    setUserPasswordRepeat = hooks.setUserPasswordRepeat;
}
