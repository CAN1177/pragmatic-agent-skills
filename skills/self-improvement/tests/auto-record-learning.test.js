const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  hasReusableSignal,
  parseBoolean,
  run,
  shouldRecord,
} = require("../scripts/auto-record-learning.js");

function makeTempSkillDir() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "self-improvement-"));
  const skillDir = path.join(baseDir, "self-improvement");
  fs.mkdirSync(skillDir, { recursive: true });
  return skillDir;
}

function readJsonLines(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

test("parseBoolean accepts common truthy and falsy values", () => {
  assert.equal(parseBoolean("true", null), true);
  assert.equal(parseBoolean("0", null), false);
  assert.equal(parseBoolean(undefined, null), null);
});

test("hasReusableSignal detects whether runtime provided a signal", () => {
  assert.equal(hasReusableSignal({ signal: "correction" }), true);
  assert.equal(hasReusableSignal({}), false);
});

test("shouldRecord honors explicit false even when a signal exists", () => {
  assert.equal(
    shouldRecord({ signal: "correction", "should-record": "false" }),
    false
  );
});

test("run skips cleanly when the hook is called without a reusable signal", () => {
  const result = run({ "used-skill": "frontend-api-integration" });

  assert.deepEqual(result, {
    recorded: false,
    reason: "Skipped learning record: no reusable signal",
  });
});

test("run records when a reusable signal is present", () => {
  const skillDir = makeTempSkillDir();

  const result = run(
    {
      "used-skill": "frontend-api-integration",
      signal: "success",
      task: "Generate integration checklist",
      observed: "A field-first checklist reduced back-and-forth",
      feedback: "This structure is reusable",
      lesson: "For integration tasks, lead with field mappings",
      "target-scope": "skill",
      "target-name": "frontend-api-integration",
      "task-id": "api-010",
      source: "session-010",
    },
    {
      skillDir,
      nowIso: () => "2026-07-02T08:00:00.000Z",
    }
  );

  const events = readJsonLines(path.join(skillDir, ".learnings", "events.jsonl"));

  assert.equal(result.recorded, true);
  assert.equal(result.event.signal_type, "success_pattern");
  assert.equal(events.length, 1);
  assert.equal(
    events[0].proposed_lesson,
    "For integration tasks, lead with field mappings"
  );
});
