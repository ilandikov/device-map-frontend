import { fireEvent, getByTestId, getByText } from '@testing-library/react';
import React from 'react';
import { PasswordCreationForm } from '../PasswordCreationForm';
import {
    createEvent,
    renderForActionDispatchTest,
    renderForSnapshotTest,
} from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalInputType,
    LoginModalRemoteRequestType,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import {
    mockDispatch,
    mockLoginModalAuthenticationState,
    mockPrepareSelector,
} from '../../../../redux/__mocks__/mocks';

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
        mockLoginModalAuthenticationState({});
        const component = renderForSnapshotTest(<PasswordCreationForm />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password not match error', () => {
        mockLoginModalAuthenticationState({
            error: new Error('renderMeToo'),
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
            loginModalInput(LoginModalInputType.PASSWORD, 'verySecurePassword1'),
        );
    });

    it('should update repeated user password when typed', () => {
        const container = renderForActionDispatchTest(<PasswordCreationForm />);

        const userPasswordRepeatInput = getByTestId(container, 'userPasswordRepeat');
        fireEvent.change(userPasswordRepeatInput, createEvent('evenBetterPassword'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputType.PASSWORD_REPEAT, 'evenBetterPassword'),
        );
    });

    it('should call password verification when next button is pressed', () => {
        const container = renderForActionDispatchTest(<PasswordCreationForm />);

        const tryVerifyPasswordsButton = getByText(container, 'next');
        fireEvent.click(tryVerifyPasswordsButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalRemoteRequest(LoginModalRemoteRequestType.PASSWORD));
    });
});
