# JobJD-Greeting-Generator

Generate one copy-ready recruiting message from a job description and real candidate facts.

## What This Skill Does

This skill is built for recruiting chat scenarios such as BOSS直聘, 智联招聘, and 前程无忧.

It takes two noisy inputs:

- job information from `jd_url` or `jd_text`
- candidate information from brief, highlights, and current status

And turns them into one short message that is ready to send.

The design goal is not to produce many options. The default goal is to produce one usable answer.

## Why This Skill Is Worth Keeping

Most JD drafting flows fail too early: if the page is messy, they immediately ask the user to paste the full text.

This skill is stricter:

1. try direct page extraction
2. try readability or third-party text extraction
3. infer missing fields conservatively from recovered text
4. ask for `jd_text` only when the previous steps are still unreliable

That fallback discipline is the main value of this skill.

## Best Fit

Use this skill when you need:

- a first-contact recruiting message
- a light follow-up after read-without-reply
- a polite follow-up after silence
- a concise message that leads with candidate value instead of generic greetings

Do not use it for:

- auto-applying to jobs
- sending messages on the user's behalf
- generating resumes or long cover letters
- inventing experience, numbers, or credentials

## Inputs

Required: at least one of

- `jd_url`
- `jd_text`

Optional:

- `position_name`
- `company_name`
- `candidate_brief`
- `candidate_highlights`
- `candidate_status`
- `hr_role`
- `hr_gender`
- `tone_style`
- `scenario`
- `length_limit`
- `platform`

Recommended minimum:

```text
jd_url
candidate_brief
candidate_highlights
candidate_status
scenario
tone_style
```

## Output Contract

By default, the skill returns:

- exactly one final message

For `first_contact`, the opening should lead with:

- greeting
- years or direction
- strongest matching advantage

It should not default to weak openings like:

- "看到贵司正在招聘……"
- "关注到贵司这个岗位……"
- "我是[姓名]……"

## Workflow

### 1. Recover the JD

If `jd_url` exists, try to recover usable JD information in a fixed order:

1. direct page extraction
2. readability or third-party extraction
3. conservative inference from recovered text

Only ask for `jd_text` when those steps still fail.

### 2. Resolve Field Priority

Use this precedence:

1. user-supplied fields
2. explicit fields from the original page
3. explicit fields from fallback extraction
4. conservative inference

### 3. Generate the Message

Internally, the message is built from:

1. identity label
2. job match points
3. low-pressure close

The visible surface stays short and copy-ready.

## Scenarios

### `first_contact`

Lead with value. Do not spend the first sentence explaining why the user noticed the role.

### `follow_up_read`

Assume the earlier message was seen. Add one small piece of value and stay polite.

### `follow_up_silent`

Check progress without mentioning "read" status and without pressure.

## Example

Input:

```text
jd_url: https://example.com/job/123
candidate_brief: 3 年后端开发，做过支付与会员系统
candidate_highlights:
- 负责过高并发支付链路重构，接口成功率提升到 99.95%
- 熟悉 Java、Spring Boot、MySQL、Redis
- 最近在会员权益系统中负责活动引擎改造
candidate_status: 在职，正在看更匹配的后端机会
scenario: first_contact
tone_style: 自然专业
platform: BOSS直聘
```

Expected behavior:

1. extract the JD from `jd_url`
2. fall back if direct extraction is weak
3. only ask for `jd_text` if recovery still fails
4. return one short final message

Example output:

```text
您好，我有 3 年后端开发经验，做过高并发支付链路重构，熟悉 Java、Spring Boot、MySQL、Redis，也参与过会员权益系统改造。简历附上，盼您回复。
```

What this shows:

- the opening leads with value instead of role-chasing small talk
- only one final answer is returned
- the message stays short enough for recruiting chat

## Boundaries

- never fabricate candidate experience
- never pressure HR
- never force uncertain company or role names into the message
- keep the close short and operational

## Installation / Runtime Use

Place this skill in a runtime-visible skill directory, for example:

```text
~/.agents/skills/JobJD-Greeting-Generator
~/.claude/skills/JobJD-Greeting-Generator
~/.cursor/skills/JobJD-Greeting-Generator
<repo>/skills/JobJD-Greeting-Generator
```

Minimum expectation:

- `README.md` explains the public contract
- `SKILL.md` defines agent-facing execution rules

If your runtime supports skill loading by directory, keeping both files in the same folder is enough.

## Files

- [SKILL.md](SKILL.md): agent-facing rules
