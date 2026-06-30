# Skills Index

This repository is organized around standalone agent skills.

Each skill directory should contain:

- `SKILL.md`: agent-facing execution rules
- `README.md`: public explanation, usage, examples, and boundaries
- optional scripts, templates, or references needed by the skill

## Available Skills

### [JobJD-Greeting-Generator](JobJD-Greeting-Generator/README.md)

Generate one copy-ready recruiting chat opener from a JD and candidate facts, with strong fallback behavior around `jd_url` extraction.

Best for:

- BOSS直聘 / 智联招聘 / 前程无忧 outreach
- first-contact and follow-up message drafting
- converting messy job pages into concise, usable output

### [leetcode-coach](leetcode-coach/README.md)

Keep the coaching logic public while storing the learner's actual progress in a separate private Git repository.

Best for:

- repeatable LeetCode practice workflows
- agent-assisted study logs
- clean separation of shared tools and private learning data

### [self-improvement](self-improvement/README.md)

Capture usage feedback, distill repeated patterns, and propose improvements for skills without directly rewriting them.

Best for:

- long-running agent workflows
- evidence-based skill evolution
- turning repeated corrections into reusable rules
