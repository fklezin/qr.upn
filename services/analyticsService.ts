// This allows TypeScript to recognize the gtag function on the window object
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: object) => void;
  }
}

/**
 * Tracks a custom event with Google Analytics.
 * @param {string} action - The event action (e.g., 'scan_success').
 * @param {string} category - The event category (e.g., 'Conversion').
 * @param {string} label - The event label (e.g., 'camera_scan').
 * @param {number} [value] - An optional numeric value for the event.
 */
export const trackEvent = (
  action: string,
  category: string,
  label: string,
  value?: number
) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    // This can happen if GA is blocked by an ad blocker or fails to load.
    // We log it to the console for debugging purposes.
    console.warn(`Google Analytics not found. Event not tracked:`, { action, category, label, value });
  }
};
