# Design Principles

This repository is not trying to contain every possible agent capability.

It is trying to collect skills that are:

## 1. Narrow

A skill should solve one concrete class of task. If a skill tries to do too much, reuse quality drops fast.

## 2. Operational

Important workflow details should be explicit:

- what inputs are required
- what fallback path exists
- when to stop and ask for more data

## 3. Public By Default

A public skill must still make sense to someone outside the original environment. Private data, machine-local assumptions, and hidden process knowledge should not be required to understand the design.

## 4. Safe Around User Data

If a workflow mixes shared logic with user-owned records, the boundary must be explicit. Public templates are not private state.

## 5. Honest About Limits

A skill should define non-goals. Avoid pretending a narrow automation is a general-purpose system.

## 6. Backed By Examples

A skill is stronger when a reader can see:

- a realistic input
- the expected output or behavior
- the fallback logic

## 7. Worth Copying

The standard is not "interesting idea". The standard is "another engineer would copy this into their own setup".
