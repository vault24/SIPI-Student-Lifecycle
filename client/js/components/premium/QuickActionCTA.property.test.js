/**
 * Quick Action CTA - Property-Based Tests
 * Tests for quick action button gradient styling
 */

import fc from 'fast-check';

describe('Quick Action CTA - Property-Based Tests', () => {
  
  /**
   * Feature: premium-ui-redesign, Property 11: Quick action gradient styling
   * Validates: Requirements 4.4
   * 
   * For any quick action button, it should have a gradient background 
   * (background-image with linear-gradient).
   */
  test('all quick action buttons have gradient backgrounds', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('add-student', 'view-documents', 'manage-alumni'),
        (actionType) => {
          const button = document.createElement('button');
          button.className = `quick-action quick-action-${actionType}`;
          button.textContent = actionType;
          document.body.appendChild(button);
          
          const styles = window.getComputedStyle(button);
          const backgroundImage = styles.backgroundImage;
          
          button.remove();
          
          expect(backgroundImage).toContain('linear-gradient');
        }
      ),
      { numRuns: 100 }
    );
  });
});
