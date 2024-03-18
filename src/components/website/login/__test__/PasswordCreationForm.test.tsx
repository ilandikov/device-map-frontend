import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureTestStore } from '../../../../../tests/utils';
import { PasswordCreationForm } from '../PasswordCreationForm';
import { createEvent } from '../../TestHelpers';
import {
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalInput,
    loginModalVerifyRequest,
} from '../redux/actions';
import { mockDispatch, mockLoginModalState, mockPrepareSelector } from '../redux/__mocks__/LoginModalState';
import { renderAsJSON } from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

function componentWithStoreProvider() {
    return (
        <Provider store={configureTestStore()}>
            <PasswordCreationForm />
        </Provider>
    );
}

describe('PasswordCreationForm snapshot tests', () => {
    it('should match the snapshot without error', () => {
        mockLoginModalState({
            userPasswordError: null,
        });
        const component = renderAsJSON(componentWithStoreProvider());

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password not match error', () => {
        mockLoginModalState({
            userPasswordError: new Error(),
        });
        const component = renderAsJSON(componentWithStoreProvider());

        expect(component).toMatchSnapshot();
    });
});

describe('PasswordCreationForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should update user password when typed', () => {
        const { container } = render(componentWithStoreProvider());

        const userPasswordInput = getByTestId(container, 'userPassword');
        fireEvent.change(userPasswordInput, createEvent('verySecurePassword1'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_PASSWORD, 'verySecurePassword1'),
        );
    });

    it('should update repeated user password when typed', () => {
        const { container } = render(componentWithStoreProvider());

        const userPasswordRepeatInput = getByTestId(container, 'userPasswordRepeat');
        fireEvent.change(userPasswordRepeatInput, createEvent('evenBetterPassword'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_PASSWORD_REPEAT, 'evenBetterPassword'),
        );
    });

    it('should call password verification when next button is pressed', () => {
        const { container } = render(componentWithStoreProvider());

        const tryVerifyPasswordsButton = getByText(container, 'next');
        fireEvent.click(tryVerifyPasswordsButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD));
    });
});
