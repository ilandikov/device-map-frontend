/* External dependencies */
import React from 'react';
import '@testing-library/jest-dom';

/* Local dependencies */
import { LoginModal } from '../LoginModal';
import { mockDispatch, mockLoginModalState, mockPrepareSelector } from '../redux/__mocks__/LoginModalState';
import { UserAuthState } from '../redux/state';

import { renderForSnapshotTest } from '../../TestHelpers';

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
            userAuthState: UserAuthState.WELCOME,
        });

        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockLoginModalState({
            userEmail: '',
            userAuthState: UserAuthState.MAIL_INPUT,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN,
            userEmail: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN_PASSWORD_RESET,
            userEmail: '',
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP for login stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for login stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN_OTP_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password creation stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.SIGNUP_OTP,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for sign up stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.SIGNUP_OTP_LOADING,
        });
        const component = renderForSnapshotTest(<LoginModal />);

        expect(component).toMatchSnapshot();
    });
});
