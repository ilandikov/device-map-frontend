import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { testSnapshot } from '../../../../../../tests/utils/RenderingHelpers';
import { LocationAddress } from '../LocationAddress';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('location address snapshot tests', () => {
    it('should show address loader when there is no address', () => {
        mockMapAppState({
            selectedMarker: {
                location: { lat: 6.3, lon: 9.2 },
                address: null,
            },
        });

        testSnapshot(<LocationAddress />);
    });

    it('should show the address', () => {
        mockMapAppState({
            selectedMarker: {
                location: { lat: 26.3553423, lon: 19.23131 },
                address: {
                    line1: 'Street and number',
                    line2: 'District and city',
                },
            },
        });

        testSnapshot(<LocationAddress />);
    });
});
