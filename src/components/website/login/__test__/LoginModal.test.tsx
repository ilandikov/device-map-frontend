import React from 'react';
import '@testing-library/jest-dom';
import { LoginModal } from '../LoginModal';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { AuthenticationStep } from '../redux/AuthenticationState';
import { testSnapshot } from '../../../../../tests/utils/RenderingHelpers';

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

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at mail input stage', () => {
        mockAuthenticationState({
            email: '',
            step: AuthenticationStep.MAIL_INPUT,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at login stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.LOGIN,
            email: '',
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at login loading step', () => {
        mockAuthenticationState({
            step: AuthenticationStep.LOGIN_LOADING,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at password reset request stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            email: '',
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at password reset request loading stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at password reset stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at OTP for login stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at OTP checking for login stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at password creation stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at password creation loading stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_LOADING,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at OTP input stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at OTP checking for sign up stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });

        testSnapshot(<LoginModal />);
    });

    it('should match the snapshot at OTP resending for sign up stage', () => {
        mockAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING,
        });

        testSnapshot(<LoginModal />);
    });
});
