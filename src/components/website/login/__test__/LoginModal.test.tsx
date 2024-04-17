import React from 'react';
import '@testing-library/jest-dom';
import { LoginModal } from '../LoginModal';
import {
    mockDispatch,
    mockLoginModalAuthenticationState,
    mockPrepareSelector,
} from '../../../../redux/__mocks__/mocks';
import { AuthenticationStep } from '../redux/LoginModalAuthenticationState';
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
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.WELCOME,
        });

        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockLoginModalAuthenticationState({
            email: '',
            step: AuthenticationStep.MAIL_INPUT,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login stage', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.LOGIN,
            email: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login loading step', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.LOGIN_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset request stage', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            email: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset stage', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP for login stage', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for login stage', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password creation stage', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password creation loading stage', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for sign up stage', () => {
        mockLoginModalAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });
});
