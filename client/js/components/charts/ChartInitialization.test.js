/**
 * Chart Initialization Tests
 * Property-based tests for Chart.js library initialization
 * Feature: dashboard-restructure, Property 3: Chart Library Initialization
 * Validates: Requirements 3.3
 */

import { test } from 'node:test';
import assert from 'node:assert';

test('Property 3: Chart Library Initialization - Chart.js should be available', () => {
    // Verify Chart.js is available globally
    assert(typeof Chart !== 'undefined', 'Chart.js library must be available');
    assert(typeof Chart === 'function', 'Chart must be a constructor function');
});

test('AttendanceChart - should throw error if container element does not exist', () => {
    assert.throws(() => {
        new AttendanceChart({
            containerId: 'non-existent-container',
            semesters: ['Sem 1'],
            attendancePercentages: [85]
        });
    }, 'Should throw error when container not found');
});

test('DepartmentDistributionChart - should throw error if container element does not exist', () => {
    assert.throws(() => {
        new DepartmentDistributionChart({
            containerId: 'non-existent-container',
            departments: ['CSE'],
            studentCounts: [100]
        });
    }, 'Should throw error when container not found');
});
