import React from 'react';
import renderer from 'react-test-renderer';

export const setUserAuthState = jest.fn().mockImplementation((userAuthState) => userAuthState);
export const setUserEmail = jest.fn().mockImplementation((userEmail) => userEmail);
export const setUserPassword = jest.fn().mockImplementation((userEmail) => userEmail);
export const setUserPasswordRepeat = jest.fn().mockImplementation((userEmail) => userEmail);

export function resetHookMocks() {}

export function renderAsJSON(component: React.ReactElement) {
    return renderer.create(component).toJSON();
}
