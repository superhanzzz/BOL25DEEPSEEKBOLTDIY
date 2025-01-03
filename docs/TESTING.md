# Board of Life - Testing Documentation

## Table of Contents
1. [Test Suite Overview](#test-suite-overview)
2. [Running the Tests](#running-the-tests)
3. [Test Categories](#test-categories)
4. [Expected Results](#expected-results)
5. [Troubleshooting](#troubleshooting)
6. [Continuous Integration](#continuous-integration)

## Test Suite Overview

The Board of Life test suite is designed to validate:
- Database schema and relationships
- CRUD operations for all models
- Versioning and historical tracking
- Data consistency and integrity
- Performance with large datasets

## Running the Tests

### Prerequisites
- Node.js (v16 or higher)
- NPM (v7 or higher)
- SQLite3 (for in-memory testing)

### Installation
1. Install test dependencies:
   ```bash
   npm install --save-dev jest sqlite3
   ```

2. Set up test environment:
   ```bash
   cp .env.test.example .env.test
   ```

### Running Tests
1. Run all tests:
   ```bash
   npx jest
   ```

2. Run specific test file:
   ```bash
   npx jest test/db.test.js
   ```

3. Run tests with verbose output:
   ```bash
   npx jest --verbose
   ```

4. Generate coverage report:
   ```bash
   npx jest --coverage
   ```

## Test Categories

### 1. Schema Validation
- Verifies table creation and column definitions
- Tests required field constraints
- Checks data type validations

### 2. Relationship Integrity
- Tests parent-child relationships
- Verifies cascade delete functionality
- Checks relationship type constraints

### 3. Versioning System
- Tests entry version creation
- Verifies metric logging
- Checks version history tracking

### 4. Data Consistency
- Tests referential integrity
- Verifies unique constraints
- Checks data validation rules

### 5. Performance Testing
- Tests bulk operations
- Verifies query performance
- Checks database scalability

## Expected Results

### Successful Test Run
- All tests should pass with green checkmarks
- No errors or warnings in the output
- Coverage report showing >90% coverage

### Example Output
```
PASS  test/db.test.js
  Database Tests
    ✓ should create and retrieve an entry (15 ms)
    ✓ should create entry relationship (8 ms)
    ✓ should track metric changes (10 ms)
    ✓ should manage participants (7 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        1.234 s
```

### Coverage Report
```
-----------------|---------|----------|---------|---------|-------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------|---------|----------|---------|---------|-------------------
All files       |   95.45 |    90.91 |   100   |   95.45 |
 models         |   100   |    100   |   100   |   100   |
  Entry.js      |   100   |    100   |   100   |   100   |
  EntryRelation.js | 100   |    100   |   100   |   100   |
-----------------|---------|----------|---------|---------|-------------------
```

## Troubleshooting

### Common Issues
1. **Test Failures**
   - Check database connection settings
   - Verify test database is properly initialized
   - Ensure all migrations have been run

2. **Performance Issues**
   - Increase test timeout if needed
   - Use `--maxWorkers` flag to control parallel execution
   - Consider using a dedicated test database

3. **Coverage Gaps**
   - Add missing test cases for uncovered code
   - Verify all edge cases are tested
   - Check for conditional branches

## Continuous Integration

The test suite is configured to run automatically in CI/CD pipelines. See the [CI Configuration](.github/workflows/ci.yml) for details.

For additional testing resources, see:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [SQLite Testing Guide](https://sqlite.org/testing.html)
- [Sequelize Testing Best Practices](https://sequelize.org/master/manual/testing.html)
