import React from 'react';
import { fireEvent, getByTestId } from '@testing-library/react';
import { MapAppHeader } from '../MapAppHeader';
import { mockDispatch } from '../redux/__mocks__/MapAppState';
import { renderForActionDispatchTest } from '../../../../../tests/utils/RenderingHelpers';
import { mapAppLoginModalOpen } from '../redux/actions';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

describe('MapAppHeader action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch click action on login button click', () => {
        const container = renderForActionDispatchTest(<MapAppHeader />);

        const loginButton = getByTestId(container, 'loginButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppLoginModalOpen());
    });
});
