import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView, GA_MEASUREMENT_ID } from '../utils/analytics';

export const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      initGA(GA_MEASUREMENT_ID);
    }
  }, []);

  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return null;
};
