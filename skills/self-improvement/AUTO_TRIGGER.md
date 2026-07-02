# Self-Improvement Auto Trigger

This document explains how `self-improvement` can be triggered automatically after other skills run.

## Goal

The goal is not to turn `self-improvement` into a passive background listener.

The practical goal is narrower:

1. call one hook after every skill invocation
2. let that hook decide whether there is a reusable learning signal
3. record only the cases worth keeping

That gives you predictable behavior without forcing every skill to know how learning storage works.

## Why A Hook Is Needed

`self-improvement` does not have a built-in way to observe every other skill call by itself.

So there are only two realistic choices:

1. the main agent remembers to call it manually
2. the skill runner calls a post-skill hook every time

The second option is more reliable. It centralizes the trigger and removes the need to trust every skill author to remember the learning checkpoint.

## Added Entry Point

Use this script as the automatic hook:

```bash
node scripts/auto-record-learning.js --context-json <file>
```

Or pass flags directly:

```bash
node scripts/auto-record-learning.js \
  --used-skill frontend-api-integration \
  --signal correction \
  --task "User asked for an API integration plan" \
  --observed "First draft missed the field mapping table" \
  --feedback "Field mapping comes first" \
  --lesson "Prioritize field mapping before process narrative" \
  --target-scope skill \
  --target-name frontend-api-integration \
  --task-id api-001 \
  --source session-001
```

## Decision Logic

The hook is safe to call after every skill run.

It uses this decision rule:

1. if `should_record=false`, skip
2. else if no `signal` is present, skip
3. else delegate to `record-from-context.js`

This means your runtime can unconditionally invoke the hook without needing separate routing logic.

## Signal Semantics

The hook expects a reusable learning signal, not a generic status code.

Supported runtime signals are:

- `correction`
- `failure`
- `success`
- `workaround`
- `capability_gap`

Those are normalized by `record-from-context.js` into:

- `user_correction`
- `error_pattern`
- `success_pattern`
- `feature_request`

## Recommended Host Integration

The simplest host-side pattern is:

1. run the requested skill
2. summarize the run into a small context object
3. call `auto-record-learning.js`
4. let the hook either skip or append an event

Pseudo-code:

```js
await runSkill(skillName, task);

await runCommand("node scripts/auto-record-learning.js --context-json /tmp/skill-context.json");
```

Example context payload:

```json
{
  "used_skill": "frontend-api-integration",
  "signal": "correction",
  "task": "User asked for an API integration plan",
  "what_happened": "First draft missed the field mapping table",
  "user_feedback": "Field mapping comes first",
  "proposed_lesson": "Prioritize field mapping before process narrative",
  "target_scope": "skill",
  "target_name": "frontend-api-integration",
  "task_id": "api-001",
  "source_reference": "session-001"
}
```

## What Gets Written

When recording happens, the hook eventually writes through `log-learning.js` into:

- `.learnings/events.jsonl`
- `.learnings/LEARNINGS.md`
- `.learnings/ERRORS.md`
- `.learnings/FEATURE_REQUESTS.md`

The exact Markdown file depends on the normalized signal type.

## Why This Design

This design keeps the boundaries clean:

- skill execution stays separate from learning storage
- automatic triggering stays centralized
- no-signal runs are cheap no-ops
- evidence collection remains explicit and auditable

That is the main principle: automatic invocation, selective recording.
