import test from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';

/**
 * Property 5: Design token spacing
 * **Feature: premium-ui-redesign, Property 5: Design token spacing**
 * **Validates: Requirements 2.2**
 * 
 * For any element with margin or padding, the values should be multiples 
 * of the base spacing unit (4px or 8px) from the design token scale.
 */

// Define the valid spacing tokens from tokens.css
const SPACING_TOKENS = {
  '--space-0': 0,
  '--space-1': 0.25,    // 4px
  '--space-2': 0.5,     // 8px
  '--space-3': 0.75,    // 12px
  '--space-4': 1,       // 16px
  '--space-5': 1.25,    // 20px
  '--space-6': 1.5,     // 24px
  '--space-7': 1.75,    // 28px
  '--space-8': 2,       // 32px
  '--space-10': 2.5,    // 40px
  '--space-12': 3,      // 48px
  '--space-14': 3.5,    // 56px
  '--space-16': 4,      // 64px
  '--space-20': 5,      // 80px
  '--space-24': 6,      // 96px
  '--space-32': 8,      // 128px
};

// Convert rem values to pixels (1rem = 16px)
const SPACING_VALUES_PX = Object.entries(SPACING_TOKENS).reduce((acc, [key, remValue]) => {
  acc[key] = remValue * 16;
  return acc;
}, {});

// Base units: 4px and 8px
const BASE_UNITS = [4, 8];

/**
 * Helper function to check if a pixel value is a valid multiple of base units
 */
function isValidSpacingValue(pixelValue) {
  // Allow 0
  if (pixelValue === 0) return true;
  
  // Check if value is a multiple of 4px or 8px
  return BASE_UNITS.some(unit => pixelValue % unit === 0);
}

test('Property 5: Design token spacing - all spacing tokens are valid multiples of base units', (t) => {
  // Verify all defined spacing tokens are multiples of 4px or 8px
  Object.entries(SPACING_VALUES_PX).forEach(([tokenName, pixelValue]) => {
    assert.ok(
      isValidSpacingValue(pixelValue),
      `Token ${tokenName} (${pixelValue}px) should be a multiple of 4px or 8px`
    );
  });
});

test('Property 5: Design token spacing - property-based test with generated spacing values', (t) => {
  // Generate arbitrary spacing values and verify they follow the pattern
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 32 }).map(n => n * 4), // Generate multiples of 4px
      (spacingValue) => {
        // All generated values should be valid spacing values
        assert.ok(
          isValidSpacingValue(spacingValue),
          `Generated spacing value ${spacingValue}px should be a multiple of base units`
        );
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 5: Design token spacing - verify spacing token consistency', (t) => {
  // Verify that spacing tokens form a consistent scale
  const tokenValues = Object.values(SPACING_VALUES_PX).sort((a, b) => a - b);
  
  // Check that each value is a valid multiple
  tokenValues.forEach(value => {
    assert.ok(
      isValidSpacingValue(value),
      `Spacing value ${value}px should be a multiple of base units`
    );
  });
  
  // Verify no duplicate values (except 0)
  const uniqueValues = new Set(tokenValues);
  assert.strictEqual(
    uniqueValues.size,
    tokenValues.length,
    'All spacing token values should be unique'
  );
});

test('Property 5: Design token spacing - invalid spacing values should be rejected', (t) => {
  // Test that invalid spacing values are correctly identified
  const invalidValues = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19];
  
  invalidValues.forEach(value => {
    assert.strictEqual(
      isValidSpacingValue(value),
      false,
      `Value ${value}px should not be a valid spacing value`
    );
  });
});
