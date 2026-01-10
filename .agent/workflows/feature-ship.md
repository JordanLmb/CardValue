---
description: The Master Workflow for shipping features using the Failproof Development System.
---

# Feature Ship Workflow

// turbo-all
This workflow orchestrates the "Failproof Loop" across multiple roles with Contract-First discipline.

## 1. Architect (Plan & Contract)
- [ ] **Research**: Use **Context7 MCP** to research best practices/security for this specific feature.
- [ ] **Analyze**: Read `agy/rules.md` and the user request.
- [ ] **Define Contract**: Create/Update `types.ts` (or equivalent) to define the EXACT API shape.
- [ ] **Plan**: Create `implementation_plan.md` referencing this contract.
- [ ] **Review**: Ask the user to approve the plan and the contract.

## 2. QA (The Shadow Test)
- [ ] **Write Failure**: Create a test file (e.g., `tests/feature.test.ts`) that imports the contract.
- [ ] **Assert**: Write the test case expecting the correct behavior.
- [ ] **Verify Failure**: Run the test to confirm it fails (Red state).

## 3. Frontend (Execute UI)
- [ ] **Check Rule**: Confirm `agy/rules.md` requires 21st.dev Magic MCP.
- [ ] **Search**: Check the **21st.dev Library** first for existing components (Cost: 0).
- [ ] **Mock**: Use the *Contract* to create a mock data object.
- [ ] **Generate**: Use Magic MCP to generate/adapt the UI (Cost: 1).
- [ ] **Iterate**: Refine with Magic MCP until visual requirements are met.

## 4. Backend (Execute Logic)
- [ ] **Implement**: Write the API logic to satisfy the *Contract*.
- [ ] **Pass Shadow Test**: Run the test from Step 2 until it passes (Green state).
- [ ] **Connect**: Wire the real API to the Frontend.

## 5. Review & Learn (Validate)
- [ ] **Present**: Show the user the results.
- [ ] **Compounding Rule**: **REQUIRED** - Propose a one-line update to `VERIFICATION.md` or `agy/rules.md`.

## 6. Publish (Context Preservation)
- [ ] **Commit**: `git commit` the changes.
- [ ] **PR**: Use **GitHub MCP** to create a PR (if on a team) OR push to branch.
