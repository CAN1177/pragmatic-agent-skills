---
name: self-improvement
description: Use this skill to capture usage learnings, distill repeated patterns, and generate improvement candidates for skills without directly rewriting the target SKILL.md. Trigger when users correct output, repeated failures appear, stable success patterns emerge, capability gaps are found, or the goal is to make a skill improve through ongoing use.
---

# Self Improvement

This skill does not directly rewrite other `SKILL.md` files. Its job is to build a low-risk, traceable learning loop for skill evolution.

## When To Use

- The user wants a skill to improve from ongoing usage.
- The user wants to save a lesson from the current interaction.
- The user corrects output and wants similar cases handled better later.
- A task pattern keeps failing or needs repeated manual cleanup.
- The user wants long-term improvement rules distilled from real usage.

Do not use this skill when:

- The task is a one-off and no learning should be retained.
- The user already wants a direct manual edit to a skill and does not need evidence collection first.

## Core Principles

1. Record experience first, discuss promotion second, modify skill rules last.
2. Do not promote a single feedback event into a long-term rule.
3. Every candidate rule must point back to concrete evidence.
4. Default to proposals, not direct skill rewrites.

## Workflow

### 1. Record Events

When one of these signals appears, record a learning event:

- user correction
- task failure
- successful repeatable method
- missing capability request

Use:

```bash
node <SKILL_DIR>/scripts/log-learning.js --help
```

### 2. Distill Patterns

After enough events are collected, distill them into candidate patterns:

```bash
node <SKILL_DIR>/scripts/distill-patterns.js --help
```

This updates:

- `.learnings/patterns.json`
- `.learnings/promotion_candidates.md`

### 3. Decide Promotion Level

Candidate patterns should be promoted to one of:

- keep inside `.learnings/`
- promote to project-wide shared guidance
- create a patch proposal for a target skill
- in rare cases, evolve into a new skill

## Minimum Promotion Threshold

By default, a candidate should meet all of these:

1. `evidence_count >= 3`
2. `distinct_tasks >= 2`
3. seen within the last 30 days
4. expressible as a reusable instruction

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

## Non-Negotiable Rules

1. Do not create a long-term rule without clear evidence.
2. Do not create a skill-level change suggestion without cross-task recurrence.
3. If a candidate conflicts with an existing rule, flag the conflict instead of silently overriding it.
4. This skill produces evidence and proposals; it does not directly modify other skills without confirmation.

## References

- [README.md](README.md): architecture, workflow, implementation notes
- [references/event-schema.md](references/event-schema.md): event field definitions
- [scripts/log-learning.js](scripts/log-learning.js): event logging script
- [scripts/distill-patterns.js](scripts/distill-patterns.js): pattern distillation script
