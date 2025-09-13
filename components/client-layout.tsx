"use client";

import React, { useEffect, useState } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side after hydration
    setIsHydrated(true);

    // Remove any browser extension attributes that might cause hydration issues
    // This is a safety measure for attributes like cz-shortcut-listen
    const removeExtensionAttributes = () => {
      const body = document.body;
      if (body.hasAttribute("cz-shortcut-listen")) {
        body.removeAttribute("cz-shortcut-listen");
      }
      // Add other common extension attributes if needed
      if (body.hasAttribute("data-new-gr-c-s-check-loaded")) {
        body.removeAttribute("data-new-gr-c-s-check-loaded");
      }
      if (body.hasAttribute("data-gr-ext-installed")) {
        body.removeAttribute("data-gr-ext-installed");
      }
    };

    // Run immediately and also after a short delay to catch any late-loading extensions
    removeExtensionAttributes();
    const timeout = setTimeout(removeExtensionAttributes, 100);

    return () => clearTimeout(timeout);
  }, []);

  // During SSR and initial hydration, render without any client-specific logic
  if (!isHydrated) {
    return <>{children}</>;
  }

  // After hydration, we can safely render with any client-specific features
  return <>{children}</>;
}
