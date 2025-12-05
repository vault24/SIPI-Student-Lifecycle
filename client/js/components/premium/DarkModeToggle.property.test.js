/**
 * Dark Mode Toggle - Property-Based Tests
 * Tests for dark mode contrast ratios and accessibility
 */

import fc from 'fast-check';

describe('Dark Mode - Property-Based Tests', () => {
  
  /**
   * Feature: premium-ui-redesign, Property 15: Dark mode contrast ratios
   * Validates: Requirements 7.5
   * 
   * For any text element in dark mode, the contrast ratio between text and 
   * background should be at least 4.5:1 for normal text and 3:1 for large text.
   */
  test('dark mode maintains sufficient contrast ratios for all text elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'button', 'a'),
        (tagName) => {
          // Create element in dark mode
          document.documentElement.classList.add('dark');
          const element = document.createElement(tagName);
          element.textContent = 'Test Content';
          element.className = 'dark:text-white dark:bg-gray-900';
          document.body.appendChild(element);
          
          // Get computed styles
          const styles = window.getComputedStyle(element);
          const textColor = styles.color;
          const bgColor = styles.backgroundColor;
          
          // Parse RGB values
          const textRGB = parseRGBColor(textColor);
          const bgRGB = parseRGBColor(bgColor);
          
          // Calculate contrast ratio
          const contrastRatio = calculateContrastRatio(textRGB, bgRGB);
          
          // Determine minimum required ratio based on font size
          const fontSize = parseInt(styles.fontSize);
          const minRatio = fontSize >= 18 ? 3 : 4.5;
          
          // Cleanup
          element.remove();
          document.documentElement.classList.remove('dark');
          
          // Assert contrast ratio meets WCAG AA standards
          expect(contrastRatio).toBeGreaterThanOrEqual(minRatio);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 15: Dark mode contrast ratios
   * Validates: Requirements 7.5
   * 
   * For any heading element in dark mode, the contrast ratio should be at least 3:1
   * since headings are typically larger text.
   */
  test('dark mode headings have sufficient contrast for large text', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('h1', 'h2', 'h3'),
        (tagName) => {
          document.documentElement.classList.add('dark');
          const element = document.createElement(tagName);
          element.textContent = 'Heading Text';
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const textColor = styles.color;
          const bgColor = styles.backgroundColor;
          
          const textRGB = parseRGBColor(textColor);
          const bgRGB = parseRGBColor(bgColor);
          const contrastRatio = calculateContrastRatio(textRGB, bgRGB);
          
          element.remove();
          document.documentElement.classList.remove('dark');
          
          // Large text requires minimum 3:1 contrast
          expect(contrastRatio).toBeGreaterThanOrEqual(3);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 15: Dark mode contrast ratios
   * Validates: Requirements 7.5
   * 
   * For any body text in dark mode, the contrast ratio should be at least 4.5:1
   * for normal text.
   */
  test('dark mode body text has sufficient contrast for normal text', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('p', 'span', 'div'),
        (tagName) => {
          document.documentElement.classList.add('dark');
          const element = document.createElement(tagName);
          element.textContent = 'Body text content';
          element.style.fontSize = '16px'; // Normal text size
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const textColor = styles.color;
          const bgColor = styles.backgroundColor;
          
          const textRGB = parseRGBColor(textColor);
          const bgRGB = parseRGBColor(bgColor);
          const contrastRatio = calculateContrastRatio(textRGB, bgRGB);
          
          element.remove();
          document.documentElement.classList.remove('dark');
          
          // Normal text requires minimum 4.5:1 contrast
          expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 15: Dark mode contrast ratios
   * Validates: Requirements 7.5
   * 
   * For any interactive element (button, link) in dark mode, the contrast ratio
   * should be at least 4.5:1 for text and 3:1 for UI components.
   */
  test('dark mode interactive elements have sufficient contrast', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'a'),
        (tagName) => {
          document.documentElement.classList.add('dark');
          const element = document.createElement(tagName);
          element.textContent = 'Interactive';
          element.className = 'dark:text-white dark:bg-blue-600';
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const textColor = styles.color;
          const bgColor = styles.backgroundColor;
          
          const textRGB = parseRGBColor(textColor);
          const bgRGB = parseRGBColor(bgColor);
          const contrastRatio = calculateContrastRatio(textRGB, bgRGB);
          
          element.remove();
          document.documentElement.classList.remove('dark');
          
          // Interactive elements require minimum 4.5:1 contrast for text
          expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 15: Dark mode contrast ratios
   * Validates: Requirements 7.5
   * 
   * For any badge or label in dark mode, the contrast ratio should be at least 3:1
   * since these are typically smaller UI components.
   */
  test('dark mode badges and labels have sufficient contrast', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('success', 'warning', 'error', 'info'),
        (badgeType) => {
          document.documentElement.classList.add('dark');
          const element = document.createElement('span');
          element.textContent = 'Badge';
          element.className = `badge-${badgeType}`;
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const textColor = styles.color;
          const bgColor = styles.backgroundColor;
          
          const textRGB = parseRGBColor(textColor);
          const bgRGB = parseRGBColor(bgColor);
          const contrastRatio = calculateContrastRatio(textRGB, bgRGB);
          
          element.remove();
          document.documentElement.classList.remove('dark');
          
          // UI components require minimum 3:1 contrast
          expect(contrastRatio).toBeGreaterThanOrEqual(3);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 15: Dark mode contrast ratios
   * Validates: Requirements 7.5
   * 
   * For any disabled element in dark mode, the contrast ratio should still be
   * at least 3:1 to maintain accessibility.
   */
  test('dark mode disabled elements maintain minimum contrast', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'input'),
        (tagName) => {
          document.documentElement.classList.add('dark');
          const element = document.createElement(tagName);
          element.textContent = 'Disabled';
          element.disabled = true;
          element.className = 'dark:text-gray-500 dark:bg-gray-800';
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const textColor = styles.color;
          const bgColor = styles.backgroundColor;
          
          const textRGB = parseRGBColor(textColor);
          const bgRGB = parseRGBColor(bgColor);
          const contrastRatio = calculateContrastRatio(textRGB, bgRGB);
          
          element.remove();
          document.documentElement.classList.remove('dark');
          
          // Even disabled elements should have minimum 3:1 contrast
          expect(contrastRatio).toBeGreaterThanOrEqual(3);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Helper function to parse RGB color string
 */
function parseRGBColor(colorString) {
  const match = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }
  return { r: 0, g: 0, b: 0 };
}

/**
 * Calculate relative luminance of a color
 */
function getRelativeLuminance(rgb) {
  const { r, g, b } = rgb;
  
  const [rs, gs, bs] = [r, g, b].map(val => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1, color2) {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}
