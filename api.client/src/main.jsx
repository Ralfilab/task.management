import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import HomeContainer from './home/pages/HomeContainer';
import BoardListContainer from './boards/pages/BoardListContainer';
import ToDoListContainer from './tasks/pages/ToDoListContainer';
import ConfigurationContainer from './configuration/pages/ConfigurationContainer';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: HomeContainer,
          },
          {
            path: 'boards',
            Component: BoardListContainer,
          },
          {
            path: '/boards/:boardId',
            Component: ToDoListContainer,
          },
          {
            path: 'configuration',
            Component: ConfigurationContainer,
          },
        ],
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,    
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);