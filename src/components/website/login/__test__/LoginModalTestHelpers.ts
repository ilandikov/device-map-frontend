import React from 'react';
import renderer from 'react-test-renderer';

export let setUserAuthState: jest.Mock;
export let setUserEmail: jest.Mock;
export let setUserPassword: jest.Mock;
export let setUserPasswordRepeat: jest.Mock;

export function resetHookMocks() {
    setUserAuthState = jest.fn().mockImplementation((userAuthState) => userAuthState);
    setUserEmail = jest.fn().mockImplementation((userEmail) => userEmail);
    setUserPassword = jest.fn().mockImplementation((userEmail) => userEmail);
    setUserPasswordRepeat = jest.fn().mockImplementation((userEmail) => userEmail);
}

export function renderAsJSON(component: React.ReactElement) {
    return renderer.create(component).toJSON();
}
