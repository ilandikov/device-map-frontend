/* External dependencies */
import React from 'react';
import { graphql } from 'gatsby';

/* Local dependencies */
import MapApp from '../components/website/mapApp/MapApp';
import Layout from '../components/layout';

export default function WebApp() {
    return (
        <Layout>
            <MapApp />
        </Layout>
    );
}

export const query = graphql`
    query ($language: String) {
        locales: allLocale(filter: { language: { eq: $language } }) {
            edges {
                node {
                    ns
                    data
                    language
                }
            }
        }
        site {
            siteMetadata {
                titleTemplate
            }
        }
    }
`;
