declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Sends page view to Google Analytics
 * 
 * @param path      string  Page path
 * @param title     string  Page title
 */

export function sendPageView(path: string, title: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "page_view",
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}