import React from 'react';
import renderer from 'react-test-renderer';

export function renderAsJSON(component: React.ReactElement) {
    return renderer.create(component).toJSON();
}
