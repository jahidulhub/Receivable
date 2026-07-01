import React from 'react';
import Home from '../pages/Home/Home';
import CustomerDetail from '../pages/CustomerDetail/CustomerDetail';
import Settings from '../pages/Settings/Settings';

export type RouteType = 'home' | 'customer-detail' | 'settings';

export interface RouteParams {
  customerId?: string;
}

export interface RouteConfig {
  path: RouteType;
  component: React.ComponentType<any>;
  params?: RouteParams;
}

export const routes: Record<RouteType, React.ComponentType<any>> = {
  'home': Home,
  'customer-detail': CustomerDetail,
  'settings': Settings,
};
