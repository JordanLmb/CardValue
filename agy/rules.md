# agy/rules.md (The Constitution)

## 1. The Failproof Loop
Every action must strictly follow this sequence:
1. **PLAN**: Analyze requirements and create a plan.md (or implementation_plan.md).
2. **VERIFY**: Before writing code, determine HOW you will verify it. Consult `VERIFICATION.md`.
3. **EXECUTE**: Implement the changes.
4. **VALIDATE**: Run the verification steps. If it fails, fix and repeat.

## 2. The 21st.dev Protocol
**MUST** use the `21st.dev` Magic MCP tool for all UI component generation.
- Don't manually write complex UI CSS/HTML scratch unless fixing a minor bug.
- Ask the Magic MCP to generate the component based on requirements.

## 3. Contract Integrity Rule
Before implementing full logic, the API Contract (types/interfaces) **MUST** be defined and locked.
- Frontend must build against the contract.
- Backend must implement the contract.
- Any change to the contract after coding starts requires a formal "Refactor Plan".

## 4. The Security Ironclad Rule
- **Secrets Management**: NEVER commit API keys, passwords, or secrets to git. Use `.env` files.
- **Input Validation**: ALL API inputs must be validated (Zod/Yup) before processing.
- **Dependency Audit**: Run `npm audit` before shipping any new feature.

## 5. The Cross-Platform Persistence Rule
*Learned from Session 1 (Shell Failures)*
- **Scripting**: Prefer defined `npm run` scripts (in package.json) over raw shell commands to ensure cross-platform compatibility (Windows/Linux).
- **Tooling**: Verify CLI tools (gh, docker, etc.) are installed before relying on them in workflows.

## 6. The Compounding Engineering Rule
After completion of any task feature or resolution of a significant bug:
- The agent **MUST** propose a specific update to `agy/rules.md` or `VERIFICATION.md` to prevent recurrence of issues or to capture new best practices.
- This analysis is a **REQUIRED** final step of the workflow.
