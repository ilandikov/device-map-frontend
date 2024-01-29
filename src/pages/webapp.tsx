/* External dependencies */
import React from 'react';
import { graphql } from 'gatsby';

/* Local dependencies */

import Login from '../components/website/login/login';
import Layout from '../components/layout';

export default function WebApp() {
    return (
        <Layout>
            <Login />
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
