# self-improvement

Capture agent usage learnings, distill repeated patterns, and turn them into evidence-backed improvement candidates.

## What This Skill Does

This skill creates a low-risk improvement loop for other skills.

It does not directly rewrite a target `SKILL.md`. Instead, it separates improvement into stages:

1. record events
2. distill repeated patterns
3. propose promotion candidates

That design keeps skill evolution traceable and avoids overreacting to one noisy correction.

## Active Trigger Model

`self-improvement` is intended to be used as a meta-skill while other skills are running.

It is not a passive background listener by itself. A skill can only be recorded actively through one of these paths:

- the main agent performs a learning checkpoint after using another skill
- a host runtime hook calls the recorder after a skill invocation
- the user explicitly asks to remember or improve a repeated behavior

The practical MVP is the first path. After any other skill finishes, the agent checks whether the run produced a reusable learning signal:

- no reusable signal: do nothing
- user correction, repeated failure, stable workaround, success pattern, or capability gap: record one event
- candidate promotion or target skill rewrite: ask for confirmation first

## Why This Skill Is Worth Keeping

Many agent systems say they "learn", but the actual loop is vague.

This skill makes the loop concrete:

- raw events are preserved
- repeated lessons are aggregated
- promotion requires evidence
- write-back can stay separate from observation

That makes it useful both as a workflow and as a design pattern for agent improvement.

## Best Fit

Use this skill when:

- users repeatedly correct similar output
- a workflow keeps failing in the same way
- a repeatable success pattern is emerging
- you want a skill to improve over time without unsafe direct rewrites

Do not use it for:

- one-off tasks with no reuse value
- immediate manual edits where evidence collection is unnecessary

## Agent Triggers

This skill is a good fit when a user says things like:

- "Remember this lesson for next time."
- "This skill keeps making the same mistake."
- "Turn these repeated corrections into an improvement proposal."
- "Track what worked here so the skill can improve over time."

Typical internal triggers:

- the user corrects the same class of output more than once
- the agent repeats a cleanup step across different tasks
- a workaround succeeds repeatedly and looks reusable
- the user asks for long-term improvement instead of a one-off fix
- another skill just produced a reusable correction, failure, workaround, success pattern, or capability gap

## Usage

Run these commands from the `self-improvement/` directory.

### 1. Record one learning event

```bash
node scripts/log-learning.js \
  --skill frontend-api-integration \
  --type user_correction \
  --task "User asked for an API integration plan" \
  --happened "First draft focused on process and missed the field mapping table" \
  --feedback "The priority is field mapping, not general process" \
  --lesson "For API integration tasks, prioritize field mapping and fallback handling" \
  --scope skill \
  --target frontend-api-integration \
  --task-id api-001 \
  --source session-2026-06-30-001
```

This appends:

- `.learnings/events.jsonl`
- one Markdown log file under `.learnings/`

For agent-driven or hook-driven recording, pass a structured skill-use summary to `record-from-context.js`:

```bash
node scripts/record-from-context.js \
  --used-skill frontend-api-integration \
  --signal correction \
  --task "User asked for an API integration plan" \
  --observed "First draft focused on process and missed the field mapping table" \
  --feedback "The priority is field mapping, not general process" \
  --lesson "For API integration tasks, prioritize field mapping and fallback handling" \
  --target-scope skill \
  --target-name frontend-api-integration \
  --task-id api-001 \
  --source session-2026-06-30-001
```

This script maps runtime-friendly signals like `correction`, `failure`, `workaround`, and `capability_gap` into the event schema used by `log-learning.js`.

### 2. Record more events for the same lesson

Do not promote a rule from one example. Record repeated corrections, failures, or success patterns across different tasks.

Typical `--type` values:

- `success_pattern`
- `user_correction`
- `error_pattern`
- `feature_request`

### 3. Distill repeated events into candidates

```bash
node scripts/distill-patterns.js
```

Or use custom thresholds:

```bash
node scripts/distill-patterns.js --min-evidence 3 --min-distinct-tasks 2
```

This generates:

- `.learnings/patterns.json`
- `.learnings/promotion_candidates.md`

### 4. Inspect the output

Check `promotion_candidates.md` to see which lessons are strong enough to propose for wider promotion.

Typical next actions:

- keep it as local evidence only
- promote it into shared guidance
- turn it into a patch proposal for another skill
- split it out into a new skill if the pattern is broad enough

## Quick Start

Minimal local workflow:

1. after using any other skill, run a learning checkpoint
2. run `node scripts/record-from-context.js ...` or `node scripts/log-learning.js ...` when a reusable signal appears
3. record more events when the same lesson appears across different tasks
4. run `node scripts/distill-patterns.js`
5. inspect `.learnings/promotion_candidates.md`
6. decide whether the candidate stays local or should be promoted further

The checkpoint is intentionally lightweight. It should not interrupt normal task completion when no durable learning signal exists.

## Runtime Integration Contract

If the host runtime supports hooks, call `record-from-context.js` after skill usage with this minimum context:

- `used_skill`: skill that produced the experience
- `signal`: `correction`, `failure`, `success`, `workaround`, or `capability_gap`
- `task`: short task summary
- `what_happened` or `observed`: concrete behavior
- `user_feedback` or `feedback`: raw correction or acceptance signal
- `proposed_lesson` or `lesson`: reusable lesson
- `target_scope`: usually `skill`
- `target_name`: usually the used skill name

Do not record every skill call. Record only when the event contains a plausible reusable lesson.

Manual fallback workflow:

1. run `node scripts/log-learning.js ...` after a correction, failure, or repeatable success
2. record more events when the same lesson appears across different tasks
3. run `node scripts/distill-patterns.js`
4. inspect `.learnings/promotion_candidates.md`
5. decide whether the candidate stays local or should be promoted further

## Workflow

### 1. Record Events

Use the logger to capture one event at a time:

```bash
node scripts/log-learning.js --help
```

Typical event types:

- user correction
- task failure
- successful repeatable method
- missing capability request

### 2. Distill Patterns

Aggregate events into reusable candidate patterns:

```bash
node scripts/distill-patterns.js --help
```

This updates:

- `.learnings/patterns.json`
- `.learnings/promotion_candidates.md`

### 3. Decide Promotion

After enough evidence exists, a candidate can remain:

- as a local learning
- as shared project guidance
- as a patch proposal for a target skill
- as the seed of a new skill

## Default Promotion Threshold

A candidate should usually satisfy all of these:

1. `evidence_count >= 3`
2. `distinct_tasks >= 2`
3. seen within the last 30 days
4. expressible as a reusable rule

## Directory Layout

```text
self-improvement/
|-- SKILL.md
|-- README.md
|-- scripts/
|   |-- log-learning.js
|   |-- record-from-context.js
|   `-- distill-patterns.js
|-- references/
|   `-- event-schema.md
`-- .learnings/
    |-- events.jsonl
    |-- LEARNINGS.md
    |-- ERRORS.md
    |-- FEATURE_REQUESTS.md
    |-- patterns.json
    `-- promotion_candidates.md
```

## Example

Record a correction:

```bash
node scripts/log-learning.js \
  --skill frontend-api-integration \
  --type user_correction \
  --task "User asked for an API integration plan" \
  --happened "First draft focused on process and missed the field mapping table" \
  --feedback "The priority is field mapping, not general process" \
  --lesson "For API integration tasks, prioritize field mapping and fallback handling" \
  --scope skill \
  --target frontend-api-integration \
  --task-id api-001
```

Then distill:

```bash
node scripts/distill-patterns.js
```

Example distilled candidate:

```text
Target: frontend-api-integration
Evidence count: 3
Distinct tasks: 2
Candidate lesson:
For API integration tasks, prioritize field mapping and fallback handling before general process explanation.
```

What this shows:

- a repeated correction becomes a reusable proposal
- promotion is evidence-backed instead of anecdotal
- the workflow stays inspectable after the fact

## Boundaries

- do not promote one correction into a durable rule
- do not silently override existing skill rules
- do not skip evidence and jump straight to rewrite
- keep proposals traceable to raw events

## Installation / Runtime Use

Place this skill in a runtime-visible skill directory, for example:

```text
~/.agents/skills/self-improvement
~/.claude/skills/self-improvement
~/.cursor/skills/self-improvement
<repo>/skills/self-improvement
```

Minimum expectation:

- `README.md` explains the public contract
- `SKILL.md` defines agent-facing execution rules
- `scripts/` and `.learnings/` stay colocated with the skill

For local use, run the helper scripts from the skill directory or reference them with an absolute path.

## Testing

This skill can be tested with Node's built-in test runner. No extra dependencies are required.

Run from the skill directory:

```bash
npm test
```

Current unit tests cover:

- CLI argument parsing
- log file routing
- pattern key normalization and grouping
- promotion threshold filtering
- candidate Markdown rendering

Integration coverage also verifies the end-to-end local workflow:

- append learning events into `.learnings/events.jsonl`
- write mirrored Markdown logs
- distill repeated events into `patterns.json`
- promote only eligible recent candidates into `promotion_candidates.md`

## Files

- [SKILL.md](SKILL.md): agent-facing rules
- [references/event-schema.md](references/event-schema.md): event fields
- [scripts/log-learning.js](scripts/log-learning.js): event logger
- [scripts/record-from-context.js](scripts/record-from-context.js): active recording entrypoint for agents or runtime hooks
- [scripts/distill-patterns.js](scripts/distill-patterns.js): pattern distillation
