import React from 'react';
import renderer from 'react-test-renderer';

export let setUserAuthState = jest.fn().mockImplementation((userAuthState) => userAuthState);
export let setUserEmail = jest.fn().mockImplementation((userEmail) => userEmail);
export let setUserPassword = jest.fn().mockImplementation((userEmail) => userEmail);
export let setUserPasswordRepeat = jest.fn().mockImplementation((userEmail) => userEmail);

export function resetHookMocks() {
    setUserAuthState = jest.fn().mockImplementation((userAuthState) => userAuthState);
    setUserEmail = jest.fn().mockImplementation((userEmail) => userEmail);
    setUserPassword = jest.fn().mockImplementation((userEmail) => userEmail);
    setUserPasswordRepeat = jest.fn().mockImplementation((userEmail) => userEmail);
}

export function renderAsJSON(component: React.ReactElement) {
    return renderer.create(component).toJSON();
}
