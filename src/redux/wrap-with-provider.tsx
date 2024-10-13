/* External dependencies */
import React from 'react';
import { Provider } from 'react-redux';

/* Local dependencies */
import { createStore } from './store';

export default ({ element }) => {
    const store = createStore();
    return <Provider store={store}>{element}</Provider>;
};
