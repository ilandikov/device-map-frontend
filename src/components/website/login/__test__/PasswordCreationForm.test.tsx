import { fireEvent, getByTestId, getByText } from '@testing-library/react';
import React from 'react';
import { PasswordCreationForm } from '../PasswordCreationForm';
import { createEvent, renderForActionDispatchTest, renderForSnapshotTest } from '../../TestHelpers';
import {
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalInput,
    loginModalVerifyRequest,
} from '../redux/actions';
import { mockDispatch, mockLoginModalState, mockPrepareSelector } from '../redux/__mocks__/LoginModalState';

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

describe('PasswordCreationForm snapshot tests', () => {
    it('should match the snapshot without error', () => {
        mockLoginModalState({
            userPasswordError: null,
        });
        const component = renderForSnapshotTest(<PasswordCreationForm />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password not match error', () => {
        mockLoginModalState({
            userPasswordError: new Error(),
        });
        const component = renderForSnapshotTest(<PasswordCreationForm />);

        expect(component).toMatchSnapshot();
    });
});

describe('PasswordCreationForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should update user password when typed', () => {
        const container = renderForActionDispatchTest(<PasswordCreationForm />);

        const userPasswordInput = getByTestId(container, 'userPassword');
        fireEvent.change(userPasswordInput, createEvent('verySecurePassword1'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_PASSWORD, 'verySecurePassword1'),
        );
    });

    it('should update repeated user password when typed', () => {
        const container = renderForActionDispatchTest(<PasswordCreationForm />);

        const userPasswordRepeatInput = getByTestId(container, 'userPasswordRepeat');
        fireEvent.change(userPasswordRepeatInput, createEvent('evenBetterPassword'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_PASSWORD_REPEAT, 'evenBetterPassword'),
        );
    });

    it('should call password verification when next button is pressed', () => {
        const container = renderForActionDispatchTest(<PasswordCreationForm />);

        const tryVerifyPasswordsButton = getByText(container, 'next');
        fireEvent.click(tryVerifyPasswordsButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD));
    });
});
