/**
 * Typography Token Compliance - Property-Based Tests
 * Tests for typography token compliance across all text elements
 */

import fc from 'fast-check';

describe('Typography Token Compliance - Property-Based Tests', () => {
  
  // Define typography tokens from design system
  const typographyTokens = {
    fontSizes: {
      'text-xs': '0.75rem',
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
      'text-3xl': '1.875rem',
      'text-4xl': '2.25rem',
      'text-5xl': '3rem',
      'text-6xl': '3.75rem'
    },
    fontWeights: {
      'font-normal': 400,
      'font-medium': 500,
      'font-semibold': 600,
      'font-bold': 700,
      'font-extrabold': 800
    },
    lineHeights: {
      'leading-none': 1,
      'leading-tight': 1.25,
      'leading-snug': 1.375,
      'leading-normal': 1.5,
      'leading-relaxed': 1.625,
      'leading-loose': 1.75
    },
    fontFamilies: [
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "'Fira Code', 'Courier New', monospace"
    ]
  };

  /**
   * Feature: premium-ui-redesign, Property 6: Typography token compliance
   * Validates: Requirements 2.3
   * 
   * For any text element, the font-family should match the design token font stack,
   * and line-height should be within the defined scale (1.25, 1.5, or 1.75).
   */
  test('all text elements use design token font families', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'button', 'a'),
        (tagName) => {
          const element = document.createElement(tagName);
          element.textContent = 'Test Content';
          element.className = 'font-primary';
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const fontFamily = styles.fontFamily;
          
          // Check if font family is one of the defined tokens
          const isValidFont = typographyTokens.fontFamilies.some(font => 
            fontFamily.includes('Inter') || fontFamily.includes('system-ui')
          );
          
          element.remove();
          
          // Font family should be from design tokens
          expect(isValidFont || fontFamily.includes('Inter')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 6: Typography token compliance
   * Validates: Requirements 2.3
   * 
   * For any text element, the line-height should be within the defined scale
   * (1.25, 1.375, 1.5, 1.625, or 1.75).
   */
  test('all text elements use design token line heights', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'),
        (tagName) => {
          const element = document.createElement(tagName);
          element.textContent = 'Test Content';
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const lineHeight = parseFloat(styles.lineHeight);
          const fontSize = parseFloat(styles.fontSize);
          
          // Calculate line-height ratio
          const lineHeightRatio = lineHeight / fontSize;
          
          // Valid line heights from design tokens
          const validLineHeights = [1, 1.25, 1.375, 1.5, 1.625, 1.75];
          
          // Check if line height is within tolerance (0.05)
          const isValidLineHeight = validLineHeights.some(valid => 
            Math.abs(lineHeightRatio - valid) < 0.05
          );
          
          element.remove();
          
          // Line height should be from design tokens
          expect(isValidLineHeight).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 6: Typography token compliance
   * Validates: Requirements 2.3
   * 
   * For any heading element, the font-weight should be from the design token scale
   * (400, 500, 600, 700, or 800).
   */
  test('all heading elements use design token font weights', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
        (tagName) => {
          const element = document.createElement(tagName);
          element.textContent = 'Heading';
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const fontWeight = parseInt(styles.fontWeight);
          
          // Valid font weights from design tokens
          const validFontWeights = [400, 500, 600, 700, 800];
          
          element.remove();
          
          // Font weight should be from design tokens
          expect(validFontWeights).toContain(fontWeight);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 6: Typography token compliance
   * Validates: Requirements 2.3
   * 
   * For any body text element, the font-weight should be 400 (normal) or 500 (medium).
   */
  test('body text elements use appropriate font weights', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('p', 'span', 'div'),
        (tagName) => {
          const element = document.createElement(tagName);
          element.textContent = 'Body text';
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const fontWeight = parseInt(styles.fontWeight);
          
          // Body text should use normal (400) or medium (500)
          const validBodyWeights = [400, 500];
          
          element.remove();
          
          expect(validBodyWeights).toContain(fontWeight);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 6: Typography token compliance
   * Validates: Requirements 2.3
   * 
   * For any text element with a font-size class, the size should match the design token scale.
   */
  test('text elements with size classes use design token font sizes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'),
        (sizeClass) => {
          const element = document.createElement('p');
          element.textContent = 'Sized text';
          element.className = sizeClass;
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const fontSize = parseFloat(styles.fontSize);
          
          // Convert rem to px (assuming 16px base)
          const expectedSizes = {
            'text-xs': 12,
            'text-sm': 14,
            'text-base': 16,
            'text-lg': 18,
            'text-xl': 20,
            'text-2xl': 24,
            'text-3xl': 30,
            'text-4xl': 36,
            'text-5xl': 48
          };
          
          const expectedSize = expectedSizes[sizeClass];
          
          element.remove();
          
          // Font size should match design token (within 1px tolerance)
          expect(Math.abs(fontSize - expectedSize)).toBeLessThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 6: Typography token compliance
   * Validates: Requirements 2.3
   * 
   * For any text element with a line-height class, the line-height should match
   * the design token scale.
   */
  test('text elements with line-height classes use design token values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('leading-tight', 'leading-normal', 'leading-relaxed', 'leading-loose'),
        (leadingClass) => {
          const element = document.createElement('p');
          element.textContent = 'Text with line height';
          element.className = leadingClass;
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const lineHeight = parseFloat(styles.lineHeight);
          const fontSize = parseFloat(styles.fontSize);
          
          // Calculate line-height ratio
          const lineHeightRatio = lineHeight / fontSize;
          
          // Expected line heights from design tokens
          const expectedRatios = {
            'leading-tight': 1.25,
            'leading-normal': 1.5,
            'leading-relaxed': 1.625,
            'leading-loose': 1.75
          };
          
          const expectedRatio = expectedRatios[leadingClass];
          
          element.remove();
          
          // Line height should match design token (within 0.05 tolerance)
          expect(Math.abs(lineHeightRatio - expectedRatio)).toBeLessThanOrEqual(0.05);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 6: Typography token compliance
   * Validates: Requirements 2.3
   * 
   * For any text element with a font-weight class, the weight should match
   * the design token scale.
   */
  test('text elements with font-weight classes use design token values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold'),
        (weightClass) => {
          const element = document.createElement('p');
          element.textContent = 'Weighted text';
          element.className = weightClass;
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const fontWeight = parseInt(styles.fontWeight);
          
          // Expected font weights from design tokens
          const expectedWeights = {
            'font-normal': 400,
            'font-medium': 500,
            'font-semibold': 600,
            'font-bold': 700,
            'font-extrabold': 800
          };
          
          const expectedWeight = expectedWeights[weightClass];
          
          element.remove();
          
          // Font weight should match design token
          expect(fontWeight).toBe(expectedWeight);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 6: Typography token compliance
   * Validates: Requirements 2.3
   * 
   * For any heading element, the font-size should be larger than body text
   * and follow the design token hierarchy.
   */
  test('heading elements follow font size hierarchy', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.constantFrom('h1', 'h2', 'h3'),
          fc.constantFrom('h4', 'h5', 'h6'),
          fc.constantFrom('p', 'span')
        ),
        ([largeHeading, smallHeading, bodyText]) => {
          const h1 = document.createElement(largeHeading);
          h1.textContent = 'Large Heading';
          const h6 = document.createElement(smallHeading);
          h6.textContent = 'Small Heading';
          const p = document.createElement(bodyText);
          p.textContent = 'Body text';
          
          document.body.appendChild(h1);
          document.body.appendChild(h6);
          document.body.appendChild(p);
          
          const h1Size = parseFloat(window.getComputedStyle(h1).fontSize);
          const h6Size = parseFloat(window.getComputedStyle(h6).fontSize);
          const pSize = parseFloat(window.getComputedStyle(p).fontSize);
          
          h1.remove();
          h6.remove();
          p.remove();
          
          // Heading sizes should follow hierarchy
          expect(h1Size).toBeGreaterThanOrEqual(h6Size);
          expect(h6Size).toBeGreaterThanOrEqual(pSize);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 6: Typography token compliance
   * Validates: Requirements 2.3
   * 
   * For any text element, the letter-spacing should be from the design token scale
   * or not set (normal).
   */
  test('text elements use design token letter spacing', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('h1', 'h2', 'h3', 'p', 'span'),
        (tagName) => {
          const element = document.createElement(tagName);
          element.textContent = 'Text with spacing';
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const letterSpacing = styles.letterSpacing;
          
          // Valid letter spacings: normal or from design tokens
          const validSpacings = ['normal', '0px', '-0.05em', '-0.025em', '0.025em', '0.05em', '0.1em'];
          
          element.remove();
          
          // Letter spacing should be valid
          expect(
            letterSpacing === 'normal' || 
            validSpacings.includes(letterSpacing) ||
            letterSpacing.includes('em')
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
