/* =============================================================
   main.tsx — Application Entry Point
   =============================================================
   Purpose   : Initializes the React application, configures the router, and mounts the root element to the DOM.
   Used by   : index.html
   Depends on: react, react-dom, react-router-dom
   Notes     : Configured to use React Router v7 and wraps the entire app in RootLayout.
   ============================================================= */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from './pages/__root'
import Index from './pages/index'
import ProductDetail from './pages/product-detail'
import ArticleOne from './pages/article-1'
import ArticleTwo from './pages/article-2'
import ArticleThree from './pages/article-3'
import './styles/styles.css'
import './styles/responsive.css'

/** 
 * NotFoundComponent
 * Renders a fallback 404 error page when a user navigates to an undefined route.
 * Props: None
 */
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'article-1', element: <ArticleOne /> },
      { path: 'article-2', element: <ArticleTwo /> },
      { path: 'article-3', element: <ArticleThree /> },
      { path: '*', element: <NotFoundComponent /> },
    ],
  },
])

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
}
