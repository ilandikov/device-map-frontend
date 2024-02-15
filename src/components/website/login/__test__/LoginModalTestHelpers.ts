export function mockLoginModalHooks() {
    return {
        setUserAuthState: jest.fn().mockImplementation((userAuthState) => userAuthState),
        setUserEmail: jest.fn().mockImplementation((userEmail) => userEmail),
        setUserPassword: jest.fn().mockImplementation((userEmail) => userEmail),
        setUserPasswordRepeat: jest.fn().mockImplementation((userEmail) => userEmail),
    };
}
