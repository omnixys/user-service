/**
 * @license GPL-3.0-or-later
 * Copyright (C) 2025 Caleb Gyamfi
 * Omnixys Technologies
 */

export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    /**
     * Allowed commit types
     */
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],

    /**
     * Scope is mandatory
     */
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],

    /**
     * Header rules
     */
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],

    /**
     * 🔴 REQUIRE at least one issue reference
     * Accepts:
     * - Closes: TEST-1234
     * - Refs: TEST-1234
     * - Fixes: TEST-1234
     */
    
    // 'references-empty': [2, 'never'],
  },
};
