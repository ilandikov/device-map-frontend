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
            authenticationStep: AuthenticationStep.WELCOME,
        });

        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockAuthenticationState({
            email: '',
            authenticationStep: AuthenticationStep.MAIL_INPUT,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login stage', () => {
        mockAuthenticationState({
            authenticationStep: AuthenticationStep.LOGIN,
            email: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset stage', () => {
        mockAuthenticationState({
            authenticationStep: AuthenticationStep.LOGIN_PASSWORD_RESET,
            email: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP for login stage', () => {
        mockAuthenticationState({
            authenticationStep: AuthenticationStep.LOGIN_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for login stage', () => {
        mockAuthenticationState({
            authenticationStep: AuthenticationStep.LOGIN_OTP_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password creation stage', () => {
        mockAuthenticationState({
            authenticationStep: AuthenticationStep.SIGNUP_PASSWORD,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockAuthenticationState({
            authenticationStep: AuthenticationStep.SIGNUP_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for sign up stage', () => {
        mockAuthenticationState({
            authenticationStep: AuthenticationStep.SIGNUP_OTP_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });
});
