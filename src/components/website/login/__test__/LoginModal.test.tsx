import React from 'react';
import '@testing-library/jest-dom';
import { LoginModal } from '../LoginModal';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../redux/__mocks__/AuthenticationState';
import { AuthenticationStep } from '../redux/state';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';

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

describe('LoginModal snapshot tests', () => {
    it('should match the snapshot at user welcome stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.WELCOME,
        });

        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockAuthenticationState({
            email: '',
            step: AuthenticationStep.MAIL_INPUT,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.LOGIN,
            email: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login loading step', () => {
        mockAuthenticationState({
            step: AuthenticationStep.LOGIN_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset request stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            email: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP for login stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for login stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password creation stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for sign up stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });
});
