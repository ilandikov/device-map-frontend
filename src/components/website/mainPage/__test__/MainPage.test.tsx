import React from 'react';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import MainPage from '../MainPage';

describe('MainPage component', () => {
    it('should match the snapshot', () => {
        const component = renderForSnapshotTest(<MainPage />);

        expect(component).toMatchSnapshot();
    });
});
