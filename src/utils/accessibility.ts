// Accessibility utilities
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatAriaLabel = (action: string, element: string): string => {
  return `${action} ${element}`;
};

export const getAriaDescribedBy = (errorId?: string, helpId?: string): string | undefined => {
  const ids = [errorId, helpId].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
};

// Keyboard navigation helpers
export const handleKeyDown = (
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void,
  onTab?: () => void
) => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      onEnter?.();
      break;
    case 'Escape':
      event.preventDefault();
      onEscape?.();
      break;
    case 'Tab':
      onTab?.();
      break;
  }
};

// Focus management
export const focusFirstElement = (containerRef: React.RefObject<HTMLElement>) => {
  const container = containerRef.current;
  if (!container) return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};

export const trapFocus = (event: KeyboardEvent, containerRef: React.RefObject<HTMLElement>) => {
  const container = containerRef.current;
  if (!container) return;

  const focusableElements = Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
};

// Screen reader announcements
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the announcement after a short delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real application, you'd use a more sophisticated algorithm
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

const getLuminance = (color: string): number => {
  // Simplified luminance calculation
  // In a real application, you'd use proper color parsing
  return 0.5; // Placeholder
};

// ARIA attributes helpers
export const getAriaAttributes = (options: {
  label?: string;
  describedBy?: string;
  expanded?: boolean;
  pressed?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
}) => {
  const attributes: Record<string, string | boolean> = {};

  if (options.label) attributes['aria-label'] = options.label;
  if (options.describedBy) attributes['aria-describedby'] = options.describedBy;
  if (options.expanded !== undefined) attributes['aria-expanded'] = options.expanded;
  if (options.pressed !== undefined) attributes['aria-pressed'] = options.pressed;
  if (options.selected !== undefined) attributes['aria-selected'] = options.selected;
  if (options.disabled) attributes['aria-disabled'] = options.disabled;
  if (options.required) attributes['aria-required'] = options.required;
  if (options.invalid) attributes['aria-invalid'] = options.invalid;

  return attributes;
}; 