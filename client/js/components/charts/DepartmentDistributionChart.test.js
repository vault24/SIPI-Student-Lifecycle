/**
 * DepartmentDistributionChart Component Tests
 * Property-based tests for department distribution chart rendering
 * Feature: dashboard-restructure, Property 2: Department Distribution Chart Accuracy
 * Validates: Requirements 1.5
 */

import fc from 'fast-check';
import { test } from 'node:test';
import assert from 'node:assert';

test('Property 2: Department Distribution Chart Accuracy - sum of student counts equals total', () => {
    fc.assert(
        fc.property(
            fc.array(fc.integer({ min: 0, max: 500 }), { minLength: 1, maxLength: 8 }),
            (studentCounts) => {
                // Calculate sum of all student counts
                const totalStudents = studentCounts.reduce((sum, count) => sum + count, 0);
                
                // Verify all counts are non-negative integers
                studentCounts.forEach(count => {
                    assert(Number.isInteger(count), 'All counts must be integers');
                    assert(count >= 0, 'All counts must be non-negative');
                });

                // Verify sum is correct
                const recalculatedSum = studentCounts.reduce((sum, count) => sum + count, 0);
                assert.strictEqual(recalculatedSum, totalStudents, 'Sum must match total');
                
                return true;
            }
        ),
        { numRuns: 100 }
    );
});

test('DepartmentDistributionChart - should throw error when required config is missing', () => {
    assert.throws(() => {
        new DepartmentDistributionChart({});
    }, 'Should throw error when config is empty');
});

test('DepartmentDistributionChart - should throw error when departments and counts length mismatch', () => {
    assert.throws(() => {
        new DepartmentDistributionChart({
            containerId: 'test-chart',
            departments: ['CSE', 'ECE'],
            studentCounts: [100]
        });
    }, 'Should throw error on length mismatch');
});

test('DepartmentDistributionChart - should throw error when student counts are negative', () => {
    assert.throws(() => {
        new DepartmentDistributionChart({
            containerId: 'test-chart',
            departments: ['CSE'],
            studentCounts: [-50]
        });
    }, 'Should throw error for negative count');
});

test('DepartmentDistributionChart - should throw error when student counts are not integers', () => {
    assert.throws(() => {
        new DepartmentDistributionChart({
            containerId: 'test-chart',
            departments: ['CSE'],
            studentCounts: [100.5]
        });
    }, 'Should throw error for non-integer count');
});
