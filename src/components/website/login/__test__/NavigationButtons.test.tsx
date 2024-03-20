import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { NavigationButtons } from '../NavigationButtons';
import { mockDispatch } from '../redux/__mocks__/LoginModalState';
import { loginModalButtonClick } from '../redux/actions';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { MapAppActionTypes } from '../../mapApp/MapAppReducer';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

describe('NavigationButtons snapshot tests', () => {
    it('should match snapshot', () => {
        const component = renderForSnapshotTest(<NavigationButtons />);

        expect(component).toMatchSnapshot();
    });
});

describe('Navigation buttons tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should go back to welcome stage on cancel button click', () => {
        const container = renderForActionDispatchTest(<NavigationButtons />);

        const cancelButton = getByTestId(container, 'cancelButton');
        fireEvent.click(cancelButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: MapAppActionTypes.LOGIN_MODAL_CLOSED });
        expect(mockDispatch).toHaveBeenNthCalledWith(2, loginModalButtonClick('cancel'));
    });

    it('should go back to a desired go back state on go back button click', () => {
        const container = renderForActionDispatchTest(<NavigationButtons />);

        const goBackButton = getByTestId(container, 'goBackButton');
        fireEvent.click(goBackButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('goBack'));
    });
});
