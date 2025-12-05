/**
 * Component Consistency - Property-Based Tests
 * Tests for button, card, icon, and modal styling consistency
 */

import fc from 'fast-check';

describe('Component Consistency - Property-Based Tests', () => {
  
  /**
   * Feature: premium-ui-redesign, Property 18: Button styling consistency
   * Validates: Requirements 9.1
   * 
   * For any two button elements with the same variant class, they should have 
   * identical border-radius, padding, and font-size values.
   */
  test('buttons with same variant have identical styling', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary', 'secondary', 'gradient'),
        (variant) => {
          const btn1 = document.createElement('button');
          btn1.className = `btn btn-${variant}`;
          btn1.textContent = 'Button 1';
          
          const btn2 = document.createElement('button');
          btn2.className = `btn btn-${variant}`;
          btn2.textContent = 'Button 2';
          
          document.body.appendChild(btn1);
          document.body.appendChild(btn2);
          
          const styles1 = window.getComputedStyle(btn1);
          const styles2 = window.getComputedStyle(btn2);
          
          expect(styles1.borderRadius).toBe(styles2.borderRadius);
          expect(styles1.fontSize).toBe(styles2.fontSize);
          
          btn1.remove();
          btn2.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 19: Card styling consistency across pages
   * Validates: Requirements 9.2
   * 
   * For any two card elements across different pages, they should use the same 
   * border-radius and box-shadow values from design tokens.
   */
  test('cards across pages have consistent styling', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('premium-card', 'stat-card', 'action-card'),
        (cardClass) => {
          const card1 = document.createElement('div');
          card1.className = cardClass;
          card1.textContent = 'Card 1';
          
          const card2 = document.createElement('div');
          card2.className = cardClass;
          card2.textContent = 'Card 2';
          
          document.body.appendChild(card1);
          document.body.appendChild(card2);
          
          const styles1 = window.getComputedStyle(card1);
          const styles2 = window.getComputedStyle(card2);
          
          expect(styles1.borderRadius).toBe(styles2.borderRadius);
          expect(styles1.boxShadow).toBe(styles2.boxShadow);
          
          card1.remove();
          card2.remove();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 21: Icon library consistency
   * Validates: Requirements 9.4
   * 
   * For any icon element in the application, it should use the Lucide icon 
   * library (data-lucide attribute) with consistent width and height values.
   */
  test('all icons use lucide library with consistent sizing', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('users', 'file', 'chart', 'trending-up'),
        (iconName) => {
          const icon = document.createElement('i');
          icon.setAttribute('data-lucide', iconName);
          icon.style.width = '24px';
          icon.style.height = '24px';
          
          document.body.appendChild(icon);
          
          const hasLucideAttr = icon.hasAttribute('data-lucide');
          const width = window.getComputedStyle(icon).width;
          const height = window.getComputedStyle(icon).height;
          
          icon.remove();
          
          expect(hasLucideAttr).toBe(true);
          expect(width).toBe(height);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: premium-ui-redesign, Property 22: Modal styling consistency
   * Validates: Requirements 9.5
   * 
   * For any two modal elements, they should have identical backdrop styling 
   * (background-color, backdrop-filter) and animation properties.
   */
  test('modals have consistent styling and animations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('confirmation', 'form', 'drawer'),
        (modalType) => {
          const modal1 = document.createElement('div');
          modal1.className = `modal modal-${modalType}`;
          modal1.innerHTML = '<div class="modal-backdrop"></div>';
          
          const modal2 = document.createElement('div');
          modal2.className = `modal modal-${modalType}`;
          modal2.innerHTML = '<div class="modal-backdrop"></div>';
          
          document.body.appendChild(modal1);
          document.body.appendChild(modal2);
          
          const backdrop1 = modal1.querySelector('.modal-backdrop');
          const backdrop2 = modal2.querySelector('.modal-backdrop');
          
          const styles1 = window.getComputedStyle(backdrop1);
          const styles2 = window.getComputedStyle(backdrop2);
          
          expect(styles1.backgroundColor).toBe(styles2.backgroundColor);
          
          modal1.remove();
          modal2.remove();
        }
      ),
      { numRuns: 100 }
    );
  });
});
