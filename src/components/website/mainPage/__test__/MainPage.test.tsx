import React from 'react';
import { testSnapshot } from '../../../../../tests/utils/RenderingHelpers';
import MainPage from '../MainPage';

describe('MainPage component', () => {
    it('should match the snapshot', () => {
        testSnapshot(<MainPage />);
    });
});
