# Pragmatic Agent Skills

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-3-black.svg)](skills/README.md)
[![Status](https://img.shields.io/badge/status-active-blue.svg)](docs/roadmap.md)
[![Docs](https://img.shields.io/badge/docs-available-lightgrey.svg)](docs/getting-started.md)

An open collection of production-minded agent skills.

[中文说明](README.zh.md)

This repository focuses on one thing: reusable skills that solve real tasks with explicit rules, fallbacks, and operational boundaries. It is not a prompt dump, and it is not a generic AI toolbox.

## Why This Repo Exists

Most public AI repos have one of two problems:

- they are broad but shallow
- they look useful, but do not carry enough execution detail to be reused safely

`Pragmatic Agent Skills` is opinionated in the opposite direction:

- each skill is narrow and concrete
- each skill defines trigger conditions and non-goals
- important fallback behavior is written down
- scripts and templates are included when the skill needs them

If you build with Cursor, Claude Code, Codex, Windsurf, or similar agent systems, the goal is simple: install a skill and get repeatable behavior instead of rewriting the same working pattern every week.

## What Is In Here

Current skills:

| Skill | What it does | Why it is interesting |
| --- | --- | --- |
| [JobJD-Greeting-Generator](skills/JobJD-Greeting-Generator/README.md) | Turns a JD and candidate facts into one copy-ready recruiting message | Strong fallback design around `jd_url` extraction instead of giving up early |
| [leetcode-coach](skills/leetcode-coach/README.md) | Keeps public coaching logic separate from private LeetCode records | Clean split between shared skill logic and user-owned data |
| [self-improvement](skills/self-improvement/README.md) | Captures usage learnings and distills improvement candidates for skills | Turns repeated agent corrections into a traceable improvement loop |

Browse the full index in [skills/README.md](skills/README.md).

## Design Principles

Every skill in this repo should follow the same bar:

1. Solve one concrete problem.
2. State when the skill should and should not trigger.
3. Prefer deterministic workflow over vague guidance.
4. Preserve user-owned data boundaries.
5. Fail explicitly when confidence is low.
6. Stay useful as a public artifact, not just a personal note.

More detail: [docs/design-principles.md](docs/design-principles.md)

## Quick Start

1. Pick a skill from [skills/README.md](skills/README.md)
2. Read its `README.md` for the public contract
3. Read its `SKILL.md` for agent-facing rules
4. Reuse the included scripts/templates if the skill provides them

Setup notes: [docs/getting-started.md](docs/getting-started.md)

## Generic Prompts vs Pragmatic Skills

| Generic prompts | Pragmatic skills |
| --- | --- |
| broad instructions | narrow task scope |
| weak trigger boundaries | explicit trigger and non-goal definitions |
| one-shot output bias | repeatable workflow bias |
| hidden fallback behavior | documented fallback path |
| hard to reuse consistently | easier to install and reuse across agent runtimes |

## Repository Layout

```text
.
├── skills/   # public, reusable agent skills
├── docs/     # repo-level principles and onboarding docs
└── tests/    # focused validation for selected skills
```

## Why People Might Star This

- the skills are usable, not aspirational
- the repository shows how to package agent behavior cleanly
- the examples are grounded in real workflows
- the implementation style is narrow enough to copy

If this repo becomes valuable, it will be because each skill is a small, opinionated piece of working infrastructure.

## Contributing

Issues and PRs are welcome, especially when they improve one of these:

- skill clarity
- fallback behavior
- examples
- validation
- installation ergonomics

Contribution notes: [CONTRIBUTING.md](CONTRIBUTING.md)

## Changelog

Recent repository history: [CHANGELOG.md](CHANGELOG.md)
