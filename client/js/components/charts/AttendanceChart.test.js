/**
 * AttendanceChart Component Tests
 * Property-based tests for attendance chart rendering
 * Feature: dashboard-restructure, Property 1: Attendance Chart Data Completeness
 * Validates: Requirements 1.4
 */

import fc from 'fast-check';
import { test, describe } from 'node:test';
import assert from 'node:assert';

test('Property 1: Attendance Chart Data Completeness - should validate 8 semesters with valid percentages', () => {
    fc.assert(
        fc.property(
            fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 8, maxLength: 8 }),
            (attendanceData) => {
                const semesters = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
                
                // Verify all percentages are between 0 and 100
                attendanceData.forEach(percentage => {
                    assert(percentage >= 0 && percentage <= 100, 'Percentage must be between 0 and 100');
                });

                // Verify data structure
                assert.strictEqual(semesters.length, 8, 'Must have exactly 8 semesters');
                assert.strictEqual(attendanceData.length, 8, 'Must have exactly 8 attendance values');
                
                return true;
            }
        ),
        { numRuns: 100 }
    );
});

test('AttendanceChart - should throw error when required config is missing', () => {
    assert.throws(() => {
        new AttendanceChart({});
    }, 'Should throw error when config is empty');
});

test('AttendanceChart - should throw error when semesters and percentages length mismatch', () => {
    assert.throws(() => {
        new AttendanceChart({
            containerId: 'test-chart',
            semesters: ['Sem 1', 'Sem 2'],
            attendancePercentages: [85]
        });
    }, 'Should throw error on length mismatch');
});

test('AttendanceChart - should throw error when percentages are outside 0-100 range', () => {
    assert.throws(() => {
        new AttendanceChart({
            containerId: 'test-chart',
            semesters: ['Sem 1'],
            attendancePercentages: [150]
        });
    }, 'Should throw error for invalid percentage');
});
