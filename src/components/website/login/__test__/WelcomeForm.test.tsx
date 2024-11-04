import { fireEvent, getByText } from '@testing-library/react';
import React from 'react';
import { mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { LoginModalButton, loginModalButtonClick } from '../redux/LoginModalAction';
import { WelcomeForm } from '../WelcomeForm';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('WelcomeForm snapshot tests', () => {
    it('should match the snapshot', () => {
        const component = renderForSnapshotTest(<WelcomeForm />);

        expect(component).toMatchSnapshot();
    });
});

describe('WelcomeForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should transition to email input from welcome state', () => {
        const container = renderForActionDispatchTest(<WelcomeForm />);

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick(LoginModalButton.ACCOUNT_REGISTER));
    });

    it('should transition to login from welcome state', () => {
        const container = renderForActionDispatchTest(<WelcomeForm />);

        const loginButton = getByText(container, 'accountLogin');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick(LoginModalButton.ACCOUNT_LOGIN));
    });
});
