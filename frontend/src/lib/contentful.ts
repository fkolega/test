import { createClient } from 'contentful';
import { secureLogger } from './secure-logger';

/**
 * Initializes Contentful client with secure logging practices.
 * Environment variables are validated but not logged to prevent information disclosure.
 */
export const initializeContentfulClient = () => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  // SECURITY FIX: Use secure logging that prevents sensitive data exposure
  secureLogger.info('Initializing Contentful client');
  
  const config = {
    CONTENTFUL_SPACE_ID: spaceId,
    CONTENTFUL_ENVIRONMENT: environment,
    CONTENTFUL_ACCESS_TOKEN: accessToken
  };
  
  secureLogger.logConfigValidation(config, ['CONTENTFUL_SPACE_ID', 'CONTENTFUL_ACCESS_TOKEN']);

  if (!spaceId || !accessToken) {
    secureLogger.error('Missing required Contentful configuration', {
      missingKeys: [
        ...(!spaceId ? ['CONTENTFUL_SPACE_ID'] : []),
        ...(!accessToken ? ['CONTENTFUL_ACCESS_TOKEN'] : [])
      ]
    });
    throw new Error('Missing required Contentful configuration. Please check your environment variables.');
  }

  const client = createClient({
    space: spaceId,
    environment,
    accessToken,
  });

  secureLogger.info('Contentful client initialized successfully');
  return client;
};

export const getContentfulClient = () => {
  return initializeContentfulClient();
};