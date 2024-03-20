import React from 'react';
import '@testing-library/jest-dom';
import { LoginModal } from '../LoginModal';
import { mockDispatch, mockLoginModalState, mockPrepareSelector } from '../redux/__mocks__/LoginModalState';
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
        mockLoginModalState({
            authenticationStep: AuthenticationStep.WELCOME,
        });

        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockLoginModalState({
            email: '',
            authenticationStep: AuthenticationStep.MAIL_INPUT,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login stage', () => {
        mockLoginModalState({
            authenticationStep: AuthenticationStep.LOGIN,
            email: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset stage', () => {
        mockLoginModalState({
            authenticationStep: AuthenticationStep.LOGIN_PASSWORD_RESET,
            email: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP for login stage', () => {
        mockLoginModalState({
            authenticationStep: AuthenticationStep.LOGIN_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for login stage', () => {
        mockLoginModalState({
            authenticationStep: AuthenticationStep.LOGIN_OTP_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password creation stage', () => {
        mockLoginModalState({
            authenticationStep: AuthenticationStep.SIGNUP_PASSWORD,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockLoginModalState({
            authenticationStep: AuthenticationStep.SIGNUP_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for sign up stage', () => {
        mockLoginModalState({
            authenticationStep: AuthenticationStep.SIGNUP_OTP_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });
});
