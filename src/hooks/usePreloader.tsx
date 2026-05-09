/* =============================================================
   usePreloader.tsx — Global Loading State Context
   =============================================================
   Purpose   : Manages the global 'isLoaded' state to coordinate animations with the preloader.
   Used by   : RootLayout, Preloader, TitleReveal, etc.
   Depends on: react (Context API)
   Notes     : Components like TitleReveal wait for `isLoaded` before triggering.
   ============================================================= */

import React, { createContext, useContext, useState, useCallback } from "react";

interface PreloaderContextType {
  isLoaded: boolean;
  setLoaded: () => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

/**
 * PreloaderProvider
 * A context provider component that wraps the application to broadcast the preloader completion state.
 */
export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const setLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <PreloaderContext.Provider value={{ isLoaded, setLoaded }}>
      {children}
    </PreloaderContext.Provider>
  );
}

/**
 * usePreloader
 * A custom hook to access the current preloader state from any component within the provider.
 * @returns {PreloaderContextType} The context containing `isLoaded` boolean and `setLoaded` setter.
 */
export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (context === undefined) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
}
