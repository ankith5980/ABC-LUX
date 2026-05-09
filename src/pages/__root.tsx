/* =============================================================
   __root.tsx — Global Root Layout
   =============================================================
   Purpose   : Wraps all pages with global providers and persistent UI elements.
   Used by   : src/main.tsx
   Depends on: react-router-dom, usePreloader, CursorTrail, Preloader
   Notes     : Ensures that the custom cursor and preloader remain active across route changes.
   ============================================================= */

import { Outlet } from "react-router-dom";
import CursorTrail from "../components/ui/CursorTrail";
import Preloader from "../components/ui/Preloader";
import { PreloaderProvider } from "../hooks/usePreloader";

/** 
 * RootLayout
 * The main layout wrapper for the application. Injects global context providers 
 * and persistent components like the preloader and cursor trail around the page outlet.
 * Props: None
 */
export function RootLayout() {
  return (
    <PreloaderProvider>
      <Preloader>
        <CursorTrail />
        <Outlet />
      </Preloader>
    </PreloaderProvider>
  );
}
