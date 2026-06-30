# leetcode-coach

Keep shared coaching logic public while storing real practice records in the learner's own private Git repository.

## What This Skill Does

This skill exists to solve a structural problem:

LeetCode coaching logic is reusable, but practice records are personal.

If both live in the same public repository, you get:

- mixed ownership
- accidental overwrites
- privacy leakage
- fragile manual sync

This skill separates them cleanly.

## Why This Skill Is Worth Keeping

The key idea is not "sync files with Git". The key idea is a three-layer model:

1. shared public skill repo for rules, tools, and templates
2. machine-local working copy for operational sync
3. user-owned private repo as the source of truth

That split makes the workflow reusable without turning personal training logs into shared project data.

## Best Fit

Use this skill when:

- a learner wants agent-assisted LeetCode coaching
- progress records should stay private
- the same learner may work across multiple machines
- the agent should help maintain logs with explicit sync steps

Do not use it for:

- solving problems directly
- giving general algorithm explanations
- unrelated Git workflows

## Architecture

```text
shared skill repo
  - SKILL.md
  - records-sync.js
  - references/

machine-local workspace
  - ~/.leetcode-coach/config.json
  - ~/.leetcode-coach/records/

private remote repo
  - pattern-progress.md
  - patterns/
  - training-logs/
```

## Workflow

### 1. `init <git-url>`

Run once to connect the skill to the learner's private repository.

The script will:

- clone or reuse the local records repo
- seed missing templates without overwriting existing records
- save config locally
- create and push the initial commit when needed

### 2. `pull`

Run before starting a new pattern or practice block.

The script will:

- restore the local repo if it is missing
- fast-forward sync from remote when remote history exists
- re-check required record files and directories

### 3. `push`

Run after records are updated and the learner confirms the practice can be logged.

The script will:

- stage all changes
- skip commit if nothing changed
- push with upstream setup when needed
- fail explicitly if remote sync did not succeed

## Command Summary

```bash
node <SKILL_DIR>/records-sync.js init <git-url>
node <SKILL_DIR>/records-sync.js pull
node <SKILL_DIR>/records-sync.js push [-m msg]
node <SKILL_DIR>/records-sync.js status
```

`<SKILL_DIR>` should be the absolute path to this skill on the current machine.

## Output Contract

This skill should help maintain:

- one progress overview
- pattern-level notes
- per-problem training logs

At minimum, a training log should capture:

1. core invariant
2. trigger signal
3. key mistake
4. next practice suggestion

## Example Use

Typical lifecycle:

1. learner starts a new pattern
2. agent runs `pull`
3. agent reads the private progress files
4. learner finishes a problem and confirms it can be logged
5. agent updates records
6. agent runs `push`

Example record shape:

```text
training-logs/2026-06-30-two-sum-ii.md

- core invariant: left/right pointers move because the array is sorted
- trigger signal: sorted array + target pair lookup
- key mistake: forgot to reason about monotonic movement before coding
- next practice suggestion: 3Sum
```

What this shows:

- public skill logic stays reusable
- the learner's actual notes stay private
- the agent workflow remains explicit at every sync boundary

## Boundaries

- public `references/` are templates, never the source of truth
- no silent fallback when `pull` or `push` fails
- no record update before explicit learner confirmation
- private study data must stay outside the shared repo

## Installation / Runtime Use

Place this skill in a runtime-visible skill directory, for example:

```text
~/.agents/skills/leetcode-coach
~/.claude/skills/leetcode-coach
~/.cursor/skills/leetcode-coach
<repo>/skills/leetcode-coach
```

Minimum expectation:

- `README.md` explains the public contract
- `SKILL.md` defines agent-facing execution rules
- `records-sync.js` remains callable from the skill directory

For agent runtimes that execute local scripts, use the absolute skill path when calling `records-sync.js`.

## Files

- [SKILL.md](SKILL.md): agent-facing rules
- [records-sync.js](records-sync.js): sync tool
- [references/coach-protocol.md](references/coach-protocol.md): optional coaching protocol
