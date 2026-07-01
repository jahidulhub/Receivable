import React, { useState, useEffect } from 'react';
import { RouteType, RouteParams } from './routes';
import Home from '../pages/Home/Home';
import CustomerDetail from '../pages/CustomerDetail/CustomerDetail';
import Settings from '../pages/Settings/Settings';
import { getLocalStorage, setLocalStorage } from './storage';

interface AppState {
  currentRoute: RouteType;
  params?: RouteParams;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = getLocalStorage<AppState>('appState');
    return saved || { currentRoute: 'home' };
  });

  useEffect(() => {
    setLocalStorage('appState', appState);
  }, [appState]);

  const navigate = (route: RouteType, params?: RouteParams) => {
    setAppState({ currentRoute: route, params });
  };

  const renderPage = () => {
    switch (appState.currentRoute) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'customer-detail':
        return (
          <CustomerDetail
            customerId={appState.params?.customerId}
            onNavigate={navigate}
          />
        );
      case 'settings':
        return <Settings onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {renderPage()}
    </div>
  );
};

export default App;
