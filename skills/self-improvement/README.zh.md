# self-improvement

这是一个面向 skill 持续演化的最小工程实现。

目标不是“立即自动修改 skill”，而是先建立三层基础能力：

1. 经验采集
2. 模式归纳
3. 晋升候选

只有在后续验证通过后，才建议把候选规则真正写回目标 `SKILL.md`。

## 设计原则

- 低风险：先记录，不直接改写 skill 文件
- 可追溯：每条候选规则都能回溯到原始事件
- 分层晋升：先有事件，再有模式，最后才有候选规则
- 可扩展：后续可以接入验证、评分和 patch 生成

## 目录结构

```text
self-improvement/
|-- SKILL.md
|-- README.md
|-- README.zh.md
|-- scripts/
|   |-- log-learning.js
|   `-- distill-patterns.js
|-- references/
|   `-- event-schema.md
`-- .learnings/
    |-- events.jsonl
    |-- LEARNINGS.md
    |-- ERRORS.md
    |-- FEATURE_REQUESTS.md
    |-- patterns.json
    `-- promotion_candidates.md
```

## 当前实现

### 1. 记录经验

命令示例：

```bash
node scripts/log-learning.js \
  --skill frontend-api-integration \
  --type user_correction \
  --task "用户要求生成接口联调方案" \
  --happened "首版输出偏流程说明，缺少字段映射表" \
  --feedback "重点不是流程，而是字段如何对齐" \
  --lesson "接口联调任务优先输出字段映射与兜底策略" \
  --scope skill \
  --target frontend-api-integration \
  --task-id api-001
```

效果：

- 追加一行到 `.learnings/events.jsonl`
- 同步追加一条可读日志到对应 markdown 文件

### 2. 归纳模式

命令：

```bash
node scripts/distill-patterns.js
```

效果：

- 聚合 `.learnings/events.jsonl`
- 输出 `.learnings/patterns.json`
- 根据阈值生成 `.learnings/promotion_candidates.md`

## 当前聚合逻辑

模式按以下字段聚合：

- `target_scope`
- `target_name`
- `proposed_lesson`

也就是说，多条经验如果指向同一个目标，并且提出相同的 lesson，就会被视为同一个候选模式。

## 默认晋升阈值

- `evidence_count >= 3`
- `distinct_tasks >= 2`
- 最近 30 天内出现过

## 下一步建议

可以继续补充：

1. 冲突检测
2. patch proposal 生成器
3. 面向具体 skill 的效果对比
4. 验证通过后的写回流程

## 当前待办

1. 实现 `generate-skill-patch.js`
作用：把 `promotion_candidates.md` 里的候选规则转换成目标 skill 的 patch proposal，而不是直接修改目标 `SKILL.md`。

2. 实现 `review-and-promote.js`
作用：为候选规则增加显式状态流转，例如 `candidate -> approved -> promoted`，让晋升过程具备审计性。

3. 增加冲突检测
作用：在候选规则与现有规则语义冲突时提前标记风险，避免错误晋升。

4. 增加验证回路
作用：在规则准备写回 skill 本体前，对比 old/new skill 的输出效果，避免无效进化。
