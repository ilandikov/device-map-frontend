import React from 'react';
import { render } from '@testing-library/react';
import * as prettier from 'prettier';
import { Options } from 'approvals/lib/Core/Options';
import { verify } from 'approvals/lib/Providers/Jest/JestApprovals';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { componentWithStoreProvider, testSnapshot } from '../../../../../../tests/utils/RenderingHelpers';
import { MapAppComponents } from '../../redux/MapAppState';
import { DeviceLocation } from '../DeviceLocation';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

export function prettifyHTML(html: string) {
    return prettier.format(html, {
        parser: 'html',
        bracketSameLine: true,
        htmlWhitespaceSensitivity: 'ignore',
        printWidth: 120,
    });
}

describe('device list snapshot tests', () => {
    it('should show address loader and a list devices matching the selected marker without the create device item', async () => {
        mockMapAppState({
            component: MapAppComponents.PRODUCT_DESCRIPTION,
            devices: [
                {
                    id: '85378',
                    createdDate: '0000000000000',
                    lastUpdate: '1111111111111',
                    creatorID: 'John Doe',
                    location: { lat: 6.3, lon: 9.2 },
                    approvals: 0,
                },
            ],
            selectedMarker: {
                location: { lat: 6.3, lon: 9.2 },
                address: null,
            },
        });

        const { container } = render(componentWithStoreProvider(<DeviceLocation />));
        const htmlOutput = prettifyHTML(container.innerHTML);
        const options = new Options().forFile().withFileExtention('.html');
        verify(htmlOutput, options);
    });

    it('should show the address and a list devices matching the selected marker with the create device item', () => {
        mockMapAppState({
            component: MapAppComponents.DEVICE_LOCATION,
            loggedInUser: { id: 'I created the second one!', points: 0 },
            devices: [
                {
                    id: 'Not matching selected marker',
                    createdDate: '0000000000001',
                    lastUpdate: '0000000000002',
                    creatorID: 'someone',
                    location: { lat: 0, lon: 0 },
                    approvals: 0,
                },
                {
                    id: 'Matching selected marker',
                    createdDate: '0000000000001',
                    lastUpdate: '0000000000002',
                    creatorID: 'I created the second one!',
                    location: { lat: 26.3553423, lon: 19.23131 },
                    approvals: 0,
                },
            ],
            selectedMarker: {
                location: { lat: 26.3553423, lon: 19.23131 },
                address: {
                    line1: 'Street and number',
                    line2: 'District and city',
                },
            },
        });

        testSnapshot(<DeviceLocation />);
    });
});
