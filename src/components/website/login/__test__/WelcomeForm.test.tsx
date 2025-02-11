import React from 'react';
import { mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { LoginModalButton, loginModalButtonClick } from '../redux/LoginModalAction';
import { WelcomeForm } from '../WelcomeForm';
import { click, renderForSnapshotTest, testDispatchedAction } from '../../../../../tests/utils/RenderingHelpers';

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
        click(<WelcomeForm />, 'registerButton');

        testDispatchedAction(loginModalButtonClick(LoginModalButton.ACCOUNT_REGISTER));
    });

    it('should transition to login from welcome state', () => {
        click(<WelcomeForm />, 'loginButton');

        testDispatchedAction(loginModalButtonClick(LoginModalButton.ACCOUNT_LOGIN));
    });
});
