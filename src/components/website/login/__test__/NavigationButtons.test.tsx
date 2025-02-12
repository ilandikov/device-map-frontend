import React from 'react';
import { NavigationButtons } from '../NavigationButtons';
import { mockDispatch } from '../../../../redux/__mocks__/mocks';
import { LoginModalButton, loginModalButtonClick } from '../redux/LoginModalAction';
import {
    click,
    testDispatchedAction,
    testDispatchedActionsInOrder,
    testSnapshot,
} from '../../../../../tests/utils/RenderingHelpers';
import { mapAppLoginModalClose } from '../../mapApp/redux/MapAppAction';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

describe('NavigationButtons snapshot tests', () => {
    it('should match snapshot', () => {
        testSnapshot(<NavigationButtons />);
    });
});

describe('Navigation buttons tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should go back to welcome stage on cancel button click', () => {
        click(<NavigationButtons />, 'cancelButton');

        testDispatchedActionsInOrder([mapAppLoginModalClose(), loginModalButtonClick(LoginModalButton.CANCEL)]);
    });

    it('should go back to a desired go back state on go back button click', () => {
        click(<NavigationButtons />, 'goBackButton');

        testDispatchedAction(loginModalButtonClick(LoginModalButton.GO_BACK));
    });
});
