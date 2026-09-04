/**
 * Kindleaf App Deep Link and Store Configuration
 * 
 * Configured for Android and iOS mobile application discovery.
 */
export const KINDLEAF_APP_CONFIG = {
  appName: "Kindleaf: Handcrafted Herbal Tea",
  deepLink: "kindleaf://open", // Deep link schema to open app if installed
  playStoreUrl: "https://play.google.com/store/apps/details?id=in.kindleaf.app", // Play Store placeholder
  appStoreUrl: "https://apps.apple.com/app/kindleaf-herbal-tea/id123456789", // App Store placeholder
  fallbackUrl: "https://kindleaf.in/#get-the-app",
  features: [
    {
      title: "Direct Small-Batch Orders",
      desc: "Order directly from our batch kitchen with real-time packaging and dispatch tracking.",
      icon: "📦"
    },
    {
      title: "Mindful Ritual Guide",
      desc: "Audio-guided tea mindfulness intervals and personalized brewing timers for every hour.",
      icon: "🧘"
    },
    {
      title: "Freshness Batch Notifier",
      desc: "Get notified the moment a fresh seasonal batch is dried and packaged.",
      icon: "🍃"
    },
    {
      title: "App-Exclusive Perks",
      desc: "Priority access to limited harvest botanical blends and complimentary tea accessories.",
      icon: "✨"
    }
  ]
};

/**
 * Helper function to trigger opening the Kindleaf app,
 * or fall back gracefully if not installed.
 */
export function openKindleafApp(onFallback?: () => void) {
  if (typeof window === "undefined") return;

  const start = Date.now();
  // Attempt to open the custom app URI scheme
  window.location.href = KINDLEAF_APP_CONFIG.deepLink;

  setTimeout(() => {
    // If browser window is still active, prompt download modal or fallback
    if (Date.now() - start < 1500) {
      if (onFallback) {
        onFallback();
      } else {
        // Scroll to or open app modal
        const appSection = document.getElementById('get-the-app');
        if (appSection) {
          appSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, 1000);
}
