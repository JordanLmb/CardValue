# PROJECT VERIFICATION

## A. PRE-FLIGHT CHECKLIST (MANDATORY - Start of LAW 1)
- [ ] **RULE ACKNOWLEDGMENT:** Read `agy/rules.md` using `view_file`. State: "Acknowledging Prime Directive."
- [ ] **TOOL CHECK:** Confirm MCP servers (`magic`, `github`, `supabase`, `postgres`, `context7`) are connected.
- [ ] **ENVIRONMENT CHECK:** Verify Node/npm, Git, and Docker are available.

## B. TECHNICAL SPECIFICS & TROUBLESHOOTING
*Add specific fixes here as per LAW 6 (Knowledge Compounding).*

### 1. Windows/Shell Commands
- **COMMAND:** Always use `npx.cmd` instead of `npx`.
- **CHAINING:** Use `cmd /c "command1 && command2"` for command chains.
- **DELETION:** Use `Remove-Item -Recurse -Force` in PowerShell.
- **SCRIPT ERRORS:** If you see "running scripts is disabled" errors, wrap npm commands with `cmd /c "npm ..."` to bypass PowerShell restrictions.
- **PORT CLEANUP:** Before running `npm run dev`, ALWAYS kill port 3000 first: `npx.cmd kill-port 3000`. This prevents stuck processes.

### 2. Next.js Project Setup
- **DIRECTORY:** Run `create-next-app` in an empty `temp` folder, then move contents to root.

### 3. Testing (Jest)
- **SETUP:** Ensure `jest`, `@types/jest`, and `ts-node` are installed as devDependencies.
- **RUN:** Use `npm test` or `npx.cmd jest`.

## C. FEATURE-SPECIFIC VERIFICATION

### Feature: "Upload CSV and Display Chart"
- [ ] **Backend Test:** API accepts CSV, returns parsed JSON. Test with `curl`.
- [ ] **Frontend Test:** Chart library (Tremor/Recharts) renders with mock data.
- [ ] **Integration Test:** Full flow: upload -> parse -> display. Browser agent takes a screenshot.
- [ ] **UI Check:** Screenshot matches "Void Aesthetic" (dark purple, glassmorphism).