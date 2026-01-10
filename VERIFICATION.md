# VERIFICATION.md (The Quality Engine)

## Browser-First Verification (UI Tasks)
- [ ] **Render Check**: Does the component render without crashing?
- [ ] **Console check**: Are there any errors in the browser console?
- [ ] **Responsiveness**: Does it look good on Mobile (375px), Tablet (768px), and Desktop (1440px)?
- [ ] **Interaction**: Click all buttons and inputs. Do they respond as expected?
- [ ] **Accessibility**: Are alt tags present? Is color contrast sufficient?

## Security Verification (Required for ALL Tasks)
- [ ] **No Secrets**: Check `git status` to ensure no keys or `.env` files are staged.
- [ ] **Input Sanitization**: Confirm all user inputs are sanitized/validated.
- [ ] **Audit**: Run `npm audit` and ensure no high-severity vulnerabilities.

## New API Endpoint Verification
- [ ] **Unit Tests**: Run the specific test file for this endpoint. `npm test -- path/to/test`
- [ ] **Curl Request**: Execute a curl request to the local server.
    ```bash
    curl -v http://localhost:PORT/api/path
    ```
- [ ] **Status Code**: Confirm 2xx status for success cases, 4xx/5xx for intended error cases.
- [ ] **Logs**: Check application logs for stack traces or warnings.

## Database Migration Verification
- [ ] **Test Schema**: Run the migration on a test database first.
- [ ] **Constraints**: Verify new columns/tables have correct types and constraints (NOT NULL, FK, etc).
    - Run a sample SQL query to insert invalid data and confirm it fails.
- [ ] **Rollback**: Attempt to roll back the migration and verify the schema returns to the previous state.
