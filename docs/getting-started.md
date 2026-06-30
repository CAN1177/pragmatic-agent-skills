# Getting Started

This repo is meant to be read skill by skill.

## How To Use A Skill

1. Open the skill folder under `skills/`
2. Read `README.md` to understand the public contract
3. Read `SKILL.md` if you are wiring the skill into an agent runtime
4. Reuse any bundled scripts or templates from that same directory

## What To Expect

These skills are intentionally narrow. They are designed to be:

- easy to inspect
- easy to copy into another setup
- explicit about fallback behavior
- conservative about data boundaries

## Suggested Evaluation Checklist

Before adopting a skill, check:

- Does it solve a real workflow you already repeat?
- Are the trigger conditions clear?
- Are the failure modes acceptable?
- Does it depend on local scripts, private repos, or external services?
- Can you test it with one small example first?
