# self-improvement

Minimal engineering implementation for skill evolution through repeated use.

The goal is not "immediately rewrite a skill". The goal is to first build:

1. event capture
2. pattern distillation
3. promotion candidates

Only after later validation should a candidate rule be written back into a target `SKILL.md`.

## Design Principles

- Low risk: record first, do not directly rewrite skill files
- Traceable: every candidate rule maps back to raw events
- Layered promotion: events become patterns, then candidate rules
- Extensible: validation, scoring, and patch generation can be added later

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

## Current Implementation

### 1. Record Events

Command:

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

Effect:

- append one line to `.learnings/events.jsonl`
- append a readable entry to the matching markdown log

### 2. Distill Patterns

Command:

```bash
node scripts/distill-patterns.js
```

Effect:

- aggregate `.learnings/events.jsonl`
- write `.learnings/patterns.json`
- generate `.learnings/promotion_candidates.md` using thresholds

## Current Aggregation Logic

Patterns are grouped by:

- `target_scope`
- `target_name`
- `proposed_lesson`

In practice, multiple events are treated as the same candidate pattern when they point to the same target and propose the same lesson.

## Default Promotion Threshold

- `evidence_count >= 3`
- `distinct_tasks >= 2`
- seen within the last 30 days

## Next Steps

Possible additions:

1. conflict detection
2. patch proposal generation
3. skill-specific eval comparison
4. validated write-back flow

## Current Todo

1. Implement `generate-skill-patch.js`
Purpose: convert rules in `promotion_candidates.md` into patch proposals for a target skill instead of directly editing the target `SKILL.md`.

2. Implement `review-and-promote.js`
Purpose: add explicit state transitions such as `candidate -> approved -> promoted` so promotion becomes auditable.

3. Add conflict detection
Purpose: flag semantic conflicts between candidate rules and existing rules before promotion.

4. Add a validation loop
Purpose: compare old/new skill outputs before a rule is written back to the skill body.
