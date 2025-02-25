import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import Search from '/src/assets/images/Search.svg';

export function TerminalSearch(_props: { className: string }) {
    const { t } = useI18next();

    return (
        <div className="map-app-header-block terminal-search-header-block">
            <img src={Search} alt="terminal-search-image" />
            <input
                className="terminal-search-input"
                type="text"
                data-testid="terminalSearch"
                placeholder={t('search')}
            />
        </div>
    );
}
