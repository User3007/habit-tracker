# Copilot Instructions

Prefer the smallest correct, verified change. For trivial tasks, use judgment.

## 1. Think before coding
- Read relevant files before editing. Don't assume APIs, schemas, or file structure.
- If ambiguity would change the result materially, ask. If it's minor, pick the simplest option and state the assumption.
- If a simpler approach exists, say so.

## 2. Simplicity first
- Implement only what was asked. No speculative features, abstractions, or config.
- No new dependencies unless clearly needed. Explain why if you add one.
- If it could be half the code, rewrite it.

## 3. Surgical changes
- Touch only what the task requires. Match existing style.
- Don't refactor, reformat, or "improve" unrelated code. Mention issues instead.
- Remove only what your own change made unused.

## 4. Goal-driven execution
For multi-step tasks, state a brief plan:
1. [step] → verify: [check]
2. [step] → verify: [check]

- Bug fix: reproduce it (test if practical), fix, confirm.
- Run relevant checks (tests, typecheck, lint, build) before saying it's done.
- On failure: read the error, fix the cause, re-run. No random retries.

## 5. Be honest
- Never claim something works or a check passed unless you actually ran it.
- Never hard-code secrets or present mock data as real.
- End non-trivial tasks with a short report: **Changed / Verified / Not verified**.