#!/usr/bin/env node

const { run: recordFromContextRun } = require("./record-from-context.js");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/auto-record-learning.js --context-json <file>

  or:

  node scripts/auto-record-learning.js \\
    --used-skill <skill_name> \\
    [--should-record <true|false>] \\
    [--signal <correction|failure|success|workaround|capability_gap>] \\
    [--task <task_summary>] \\
    [--observed <what_happened>] \\
    [--feedback <user_feedback>] \\
    [--lesson <proposed_lesson>] \\
    [--target-scope <skill|project|new_skill>] \\
    [--target-name <target_name>] \\
    [--task-id <task_id>] \\
    [--source <source_reference>]

This hook is safe to call after every skill invocation.
It records only when a reusable learning signal is present.
`);
}

function pick(context, flagName, jsonName = flagName) {
  return context[flagName] || context[jsonName];
}

function parseBoolean(value, defaultValue) {
  if (value == null || value === "") {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "n"].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid boolean value: ${value}`);
}

function hasReusableSignal(context) {
  return Boolean(pick(context, "signal"));
}

function shouldRecord(context) {
  const explicit = pick(context, "should-record", "should_record");
  const explicitDecision = parseBoolean(explicit, null);
  if (explicitDecision !== null) {
    return explicitDecision;
  }
  return hasReusableSignal(context);
}

function explainSkip(context) {
  if (!hasReusableSignal(context)) {
    return "Skipped learning record: no reusable signal";
  }
  return "Skipped learning record: should-record=false";
}

function run(args, options = {}) {
  if (!shouldRecord(args)) {
    const message = explainSkip(args);
    console.log(message);
    return { recorded: false, reason: message };
  }

  const event = recordFromContextRun(args, options);
  return { recorded: true, event };
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }

  const result = run(args);
  if (result.recorded) {
    console.log(`Auto-recorded learning event ${result.event.id}`);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  explainSkip,
  hasReusableSignal,
  main,
  parseArgs,
  parseBoolean,
  pick,
  printHelp,
  run,
  shouldRecord,
};
