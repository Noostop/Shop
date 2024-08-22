import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function ThirdPartyAnalyticsIntegration() {
  const {subscribe} = useAnalytics();
  // Register this analytics integration - this will prevent any analytics events
  // from being sent until this integration is ready
  const {ready} = register('Third Party Analytics Integration');

  useEffect(() => {
    // Standard events
    subscribe('page_viewed', (data) => {
      console.log('ThirdPartyAnalyticsIntegration - Page viewed:', data);
    });
    subscribe('product_viewed', (data) => {
      console.log('ThirdPartyAnalyticsIntegration - Product viewed:', data);
    });
    subscribe('collection_viewed', (data) => {
      console.log('ThirdPartyAnalyticsIntegration - Collection viewed:', data);
    });
    subscribe('cart_viewed', (data) => {
      console.log('ThirdPartyAnalyticsIntegration - Cart viewed:', data);
    });
    subscribe('cart_updated', (data) => {
      console.log('ThirdPartyAnalyticsIntegration - Cart updated:', data);
    });

    // Custom events
    subscribe('custom_checkbox_toggled', (data) => {
      console.log(
        'ThirdPartyAnalyticsIntegration - Custom checkbox toggled:',
        data,
      );
    });

    // Mark this analytics integration as ready as soon as it's done setting up
    ready();
  }, []);

  return null;
}
