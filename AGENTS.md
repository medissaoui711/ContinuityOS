# AGENTS.md

> Primary agent instructions for this repository.
> This file must be read and followed before any change, generation, or execution.

## 1) Purpose

This repository uses AI-assisted development workflows.  
Follow these instructions strictly to ensure safe, predictable, production-ready changes.

## 2) Execution Policy

- Do not run, apply, or finalize code changes immediately.
- First provide:
  - a concise executive summary,
  - a clear implementation plan,
  - affected files/components,
  - risks and rollback notes when relevant.
- Wait for explicit approval before executing any destructive, structural, or production-impacting change.
- Approval keywords:
  - `اعتمد التغيير`
  - `ابدأ`
  - `Start`

## 3) Default Working Mode

- Prefer development or mock environments.
- Never assume production access is allowed.
- If a requirement is ambiguous, stop and ask a clarifying question.
- Keep changes minimal, targeted, and reversible.

## 4) Protocol Selection

Choose exactly one protocol based on the task:

### Safe Dev Protocol
Use for general development work, feature additions, logic changes, and performance improvements.
- Do not modify production or real data without approval.
- Use mock data or isolated environments by default.
- Before structural deletion or major refactor, present the change plan and rollback path.

### UI/UX Only Protocol
Use for visual or presentation-only work.
- Limit changes to UI layers only: CSS, HTML, components, layout, copy, and styling.
- Do not touch databases, APIs, auth, or backend logic.
- Show the affected files/components before execution.

### Data/Struct Protocol
Use for database, schema, file structure, module layout, or sensitive configuration changes.
- Do not run SQL/NoSQL/Shell commands on live systems without review.
- Present the exact change set and recovery plan before execution.
- Treat any rename, migration, or structural change as sensitive.

## 5) Logging Standards

- Use structured, actionable logs.
- Log decisions, validation results, and failure context.
- Avoid noisy or redundant logs.
- Never log secrets, tokens, credentials, or private user data.
- When adding logs, keep them consistent with the project’s existing logging style.
- Prefer levels such as:
  - `debug` for diagnostics,
  - `info` for normal milestones,
  - `warn` for recoverable issues,
  - `error` for failures.

## 6) Error Handling

- Fail fast on invalid assumptions.
- Prefer explicit validation over silent fallback.
- Surface clear, user-readable errors when relevant.
- Preserve original error context when rethrowing.
- Do not swallow exceptions unless there is a documented reason.
- For risky operations, include recovery guidance or safe fallback behavior.
- If an error may affect data integrity, stop and request confirmation.

## 7) Security Guards

- Never commit secrets, `.env` files, API keys, tokens, or private certificates.
- Never hardcode credentials in source code.
- Never print sensitive values in logs, stack traces, or responses.
- Use environment variables or a secrets manager for sensitive configuration.
- Treat all AI-generated code as untrusted until reviewed.
- Sanitize external input before use.
- Validate permissions before modifying protected resources.
- If a change weakens security, block it and explain the risk.
- Prefer secure defaults for auth, storage, network access, and data handling.

## 8) Change Discipline

- Keep patches small and reviewable.
- Avoid unrelated refactors.
- Preserve naming conventions, project structure, and architectural style.
- When a broad refactor is unavoidable, split it into phases.
- Document any assumptions that affect behavior.

## 9) Validation Expectations

- Verify syntax, types, linting, and tests where applicable.
- Do not claim a change is complete unless it has been validated.
- If full validation cannot be executed, state the limitation clearly.
- Prefer reproducible checks over manual assumptions.

## 10) Output Format

When responding to a task, use this structure:

1. Executive summary
2. Proposed plan
3. Files/components affected
4. Risks or rollback notes
5. Wait for approval if required

## 11) Priority Rules

- Safety first.
- Security second.
- Correctness third.
- Readability and maintainability fourth.
- Speed only after the above are satisfied.

## 12) Repository Notes

- Add nested AGENTS.md files in subdirectories if different rules are needed.
- The nearest AGENTS.md takes precedence for that subproject.
- Keep this file concise and maintainable.
- Update it whenever workflow, tooling, or safety requirements change.
