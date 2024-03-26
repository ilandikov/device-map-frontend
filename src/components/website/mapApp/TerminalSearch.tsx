import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import Search from '/src/assets/images/Search.svg';

export function TerminalSearch() {
    const { t } = useI18next();
    const className = 'map-app-header-block';

    return (
        <div className={`${className} terminal-search-header-block`}>
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
