# self-improvement

Capture agent usage learnings, distill repeated patterns, and turn them into evidence-backed improvement candidates.

## What This Skill Does

This skill creates a low-risk improvement loop for other skills.

It does not directly rewrite a target `SKILL.md`. Instead, it separates improvement into stages:

1. record events
2. distill repeated patterns
3. propose promotion candidates

That design keeps skill evolution traceable and avoids overreacting to one noisy correction.

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

## Files

- [SKILL.md](SKILL.md): agent-facing rules
- [references/event-schema.md](references/event-schema.md): event fields
- [scripts/log-learning.js](scripts/log-learning.js): event logger
- [scripts/distill-patterns.js](scripts/distill-patterns.js): pattern distillation
