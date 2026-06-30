# Event Schema

Each learning event is stored as one JSON line in `.learnings/events.jsonl`.

## Fields

- `id`: unique event ID
- `timestamp`: ISO timestamp
- `skill_name`: the skill that produced the experience
- `signal_type`: event category
- `task_summary`: short task summary
- `what_happened`: observed behavior
- `user_feedback`: raw user feedback or correction
- `proposed_lesson`: lesson extracted from the event
- `target_scope`: scope of the proposed change, such as `skill`, `project`, or `new_skill`
- `target_name`: target skill or target object name
- `task_id`: identifier used to distinguish task instances
- `source_reference`: optional source reference

## Suggested `signal_type` Values

- `success_pattern`
- `user_correction`
- `error_pattern`
- `feature_request`

## Example

```json
{
  "id": "evt-20260630-001",
  "timestamp": "2026-06-30T11:45:00.000+08:00",
  "skill_name": "frontend-api-integration",
  "signal_type": "user_correction",
  "task_summary": "User asked for an API integration plan",
  "what_happened": "First draft focused on process and missed the field mapping table",
  "user_feedback": "The priority is field mapping, not general process",
  "proposed_lesson": "For API integration tasks, prioritize field mapping and fallback handling",
  "target_scope": "skill",
  "target_name": "frontend-api-integration",
  "task_id": "api-001",
  "source_reference": "session-2026-06-30-001"
}
```
