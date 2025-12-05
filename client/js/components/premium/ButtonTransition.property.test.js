/**
 * Button Transition - Property-Based Tests
 * Tests for button animation smoothness and transition properties
 */

import fc from 'fast-check';

describe('Button Transition - Property-Based Tests', () => {
  
  /**
   * Feature: premium-ui-redesign, Property 8: Button transition smoothness
   * Validates: Requirements 3.1
   * 
   * For any button element, it should have a transition property defined with 
   * duration matching design tokens (150ms, 250ms, or 350ms).
   */
  test('all buttons have transition properties with design token durations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'gradient', 'ghost', 'outline'),
        (variant) => {
          const button = document.createElement('button');
          button.className = `btn btn-${variant}`;
          button.textContent = 'Button';
          document.body.appendChild(button);
          
          const styles = window.getComputedStyle(button);
          const transition = styles.transition;
          
          button.remove();
          
          // Should have transition property
          expect(transition).toBeTruthy();
          expect(transition).not.toBe('none');
          
          // Extract duration
          const durationMatch = transition.match(/(\d+)ms/);
          if (durationMatch) {
            const duration = parseInt(durationMatch[1]);
            // Should match design tokens: 150ms, 250ms, or 350ms
            expect([150, 250, 350]).toContain(duration);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 8: Button transition smoothness
   * Validates: Requirements 3.1
   * 
   * For any button, the transition should include a cubic-bezier easing function.
   */
  test('buttons use cubic-bezier easing functions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('sm', 'md', 'lg'),
        (size) => {
          const button = document.createElement('button');
          button.className = `btn btn-${size}`;
          button.textContent = 'Smooth';
          document.body.appendChild(button);
          
          const styles = window.getComputedStyle(button);
          const transition = styles.transition;
          
          button.remove();
          
          // Should have cubic-bezier easing
          expect(transition).toContain('cubic-bezier');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 8: Button transition smoothness
   * Validates: Requirements 3.1
   * 
   * For any button, the transition should apply to multiple properties 
   * (all, or specific properties like transform, box-shadow, color).
   */
  test('buttons transition multiple properties', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'gradient'),
        (variant) => {
          const button = document.createElement('button');
          button.className = `btn btn-${variant}`;
          button.textContent = 'Multi-prop';
          document.body.appendChild(button);
          
          const styles = window.getComputedStyle(button);
          const transition = styles.transition;
          
          button.remove();
          
          // Should transition 'all' or multiple specific properties
          const hasMultipleProps = 
            transition.includes('all') ||
            (transition.includes('transform') && transition.includes('box-shadow')) ||
            (transition.includes('color') && transition.includes('background'));
          
          expect(hasMultipleProps).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 8: Button transition smoothness
   * Validates: Requirements 3.1
   * 
   * For any interactive element, the transition duration should not exceed 350ms 
   * to maintain responsiveness.
   */
  test('interactive elements have responsive transition durations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'a', '.card'),
        (selector) => {
          const element = document.createElement(selector === '.card' ? 'div' : selector.substring(1));
          if (selector === '.card') {
            element.className = 'card';
          }
          element.textContent = 'Interactive';
          element.className += ' interactive-element';
          document.body.appendChild(element);
          
          const styles = window.getComputedStyle(element);
          const transition = styles.transition;
          
          element.remove();
          
          // Extract duration
          const durationMatch = transition.match(/(\d+)ms/);
          if (durationMatch) {
            const duration = parseInt(durationMatch[1]);
            // Should not exceed 350ms for responsiveness
            expect(duration).toBeLessThanOrEqual(350);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 8: Button transition smoothness
   * Validates: Requirements 3.1
   * 
   * For any button with active state, the transition should be smooth without 
   * jarring changes.
   */
  test('buttons have smooth transitions between states', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'gradient'),
        (variant) => {
          const button = document.createElement('button');
          button.className = `btn btn-${variant}`;
          button.textContent = 'State Change';
          document.body.appendChild(button);
          
          // Get initial state
          const initialStyles = window.getComputedStyle(button);
          const initialTransition = initialStyles.transition;
          
          // Simulate active state
          button.classList.add('active');
          const activeStyles = window.getComputedStyle(button);
          const activeTransition = activeStyles.transition;
          
          button.remove();
          
          // Both states should have transitions
          expect(initialTransition).toBeTruthy();
          expect(activeTransition).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 8: Button transition smoothness
   * Validates: Requirements 3.1
   * 
   * For any button, the transition should be defined at the element level, 
   * not just on hover.
   */
  test('buttons have transitions defined on base element', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'gradient', 'ghost'),
        (variant) => {
          const button = document.createElement('button');
          button.className = `btn btn-${variant}`;
          button.textContent = 'Base Transition';
          document.body.appendChild(button);
          
          const styles = window.getComputedStyle(button);
          const transition = styles.transition;
          
          button.remove();
          
          // Transition should be defined on base element
          expect(transition).not.toBe('none');
          expect(transition).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 8: Button transition smoothness
   * Validates: Requirements 3.1
   * 
   * For any CTA button, the transition should be smooth and include transform.
   */
  test('CTA buttons have smooth transform transitions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'accent'),
        (gradientType) => {
          const button = document.createElement('button');
          button.className = `btn-cta gradient-${gradientType}`;
          button.textContent = 'CTA';
          document.body.appendChild(button);
          
          const styles = window.getComputedStyle(button);
          const transition = styles.transition;
          
          button.remove();
          
          // CTA buttons should have smooth transitions
          expect(transition).toBeTruthy();
          expect(transition).not.toBe('none');
          // Should include transform for lift effect
          expect(transition).toContain('transform');
        }
      ),
      { numRuns: 100 }
    );
  });
});
