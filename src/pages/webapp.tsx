/* External dependencies */
import React from 'react';

/* Local dependencies */
import Login from '../components/website/login/login';
import Layout from '../components/layout';
import { graphql } from 'gatsby';

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
