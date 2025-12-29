'use client';

import { useEffect } from 'react';

export default function FreshchatLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    window.fcWidgetMessengerConfig = {
      open: false,
      config: {
        showFAQOnOpen: false,
        disableEvents: true,
        hideFAQ: true,
        hideRecentConversations: true,
        launcher: {
          type: "chat",
        },
        agent: {
          hideName: true,
          hidePic: true,
          hideBio: true,
        },
        headerProperty: {
          hideChatButton: true,
          hideBranding: true,
          backgroundColor: "#ffffff",
          foregroundColor: "#000000",
        },
      },
    };

    window.fcSettings = {
      onInit: function () {
        console.log("Freshchat initialized");
        window.fcWidget?.hide();
      },
    };

    const script:any = document.createElement("script");
    script.src = "https://uae.fw-cdn.com/40254093/157428.js";
    script.chat = "true";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (window.fcWidget) {
        window.fcWidget.destroy();
      }
    };
  }, []);

  return null;
}