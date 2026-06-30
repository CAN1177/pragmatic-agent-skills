# self-improvement

这是一个让 skill 基于真实使用经验持续演化的轻量工作流。

它不直接改写目标 `SKILL.md`，而是把改进拆成三步：

1. 记录事件
2. 归纳模式
3. 生成晋升候选

这样做的目的，是避免因为一次偶发反馈就把噪声写成长期规则。

## 这个 Skill 是做什么的

很多 agent 系统会说“可以学习”，但真正的学习闭环往往不清晰。

这个 skill 把闭环落成了可检查的文件流程：

- 原始事件会被保留下来
- 重复 lesson 会被聚合
- 候选规则必须有证据支持
- 观察和写回分开，风险更低

它适合作为一个独立 workflow，也适合作为其它 skill 演化机制的基础模块。

## 适用场景

适合在这些情况下使用：

- 用户反复纠正同一类输出问题
- 某个工作流总在同一个地方失败
- 某种成功做法多次复现，已经比较稳定
- 你希望 skill 能逐步优化，但不希望直接自动改写规则

不适合在这些情况下使用：

- 这是一次性任务，没有长期复用价值
- 你已经明确知道要怎么改 skill，只想直接手工修改

## Agent 触发方式

当用户出现下面这类表达时，适合触发这个 skill：

- “把这次教训记下来，下次别再犯。”
- “这个 skill 老是在同一个地方出错。”
- “把这些重复反馈整理成改进建议。”
- “把这次有效做法沉淀下来，后面复用。”

典型内部触发信号：

- 用户不止一次纠正同类问题
- agent 在不同任务里重复做同一类人工补救
- 某个 workaround 连续成功，已经像稳定方法
- 用户要的是长期改进，而不是当前这一次的修复

## 使用方式

以下命令都在 `self-improvement/` 目录下执行。

### 1. 先记录一条 learning event

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
  --task-id api-001 \
  --source session-2026-06-30-001
```

执行后会写入：

- `.learnings/events.jsonl`
- `.learnings/` 下对应的 Markdown 日志文件

### 2. 同一个 lesson 继续累计更多事件

不要因为一个样本就晋升长期规则。应该在不同任务里继续记录同类 correction、failure 或 success pattern。

常见 `--type`：

- `success_pattern`
- `user_correction`
- `error_pattern`
- `feature_request`

### 3. 把重复事件归纳成候选模式

```bash
node scripts/distill-patterns.js
```

如果要自定义阈值：

```bash
node scripts/distill-patterns.js --min-evidence 3 --min-distinct-tasks 2
```

执行后会生成：

- `.learnings/patterns.json`
- `.learnings/promotion_candidates.md`

### 4. 查看输出结果并决定是否晋升

重点查看 `promotion_candidates.md`，判断哪些 lesson 已经具备进一步晋升的证据。

常见下一步动作：

- 先保留在本地 evidence，不继续动作
- 晋升为项目级共享 guidance
- 生成针对某个 skill 的 patch proposal
- 如果模式范围更大，拆成一个新 skill

## 快速开始

最小闭环就是这 5 步：

1. 在一次 correction、failure 或 repeatable success 后执行 `node scripts/log-learning.js ...`
2. 当相同 lesson 在不同任务里再次出现时继续记录
3. 执行 `node scripts/distill-patterns.js`
4. 查看 `.learnings/promotion_candidates.md`
5. 决定这个候选只保留为证据，还是继续晋升

## 工作流

### 1. 记录事件

用下面的命令查看帮助：

```bash
node scripts/log-learning.js --help
```

常见事件类型：

- 用户纠正
- 任务失败
- 可复用的成功方法
- 缺失能力请求

### 2. 归纳模式

用下面的命令查看帮助：

```bash
node scripts/distill-patterns.js --help
```

它会更新：

- `.learnings/patterns.json`
- `.learnings/promotion_candidates.md`

### 3. 决定晋升级别

当证据足够后，一个候选规则可以停留在这些层级：

- 只作为本地 learning 保留
- 晋升为项目共享 guidance
- 变成某个目标 skill 的 patch proposal
- 在少数情况下，演化成一个新的 skill

## 默认晋升阈值

通常一个候选至少要满足：

1. `evidence_count >= 3`
2. `distinct_tasks >= 2`
3. 最近 30 天内出现过
4. 能表达成可复用的 instruction

## 当前聚合逻辑

模式按下面三个字段聚合：

- `target_scope`
- `target_name`
- `proposed_lesson`

也就是说，多条事件如果目标相同，且提出的是同一条 lesson，就会被视为同一个 pattern。

## 目录结构

```text
self-improvement/
|-- SKILL.md
|-- README.md
|-- README.zh.md
|-- package.json
|-- scripts/
|   |-- log-learning.js
|   `-- distill-patterns.js
|-- tests/
|   |-- log-learning.test.js
|   |-- distill-patterns.test.js
|   `-- workflow.integration.test.js
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

## 示例

先记录一次纠正：

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

再执行归纳：

```bash
node scripts/distill-patterns.js
```

可能得到的候选结果：

```text
Target: frontend-api-integration
Evidence count: 3
Distinct tasks: 2
Candidate lesson:
接口联调任务优先输出字段映射与兜底策略，而不是先讲通用流程。
```

这个例子说明了三点：

- 重复纠正可以被收敛成可复用提案
- 晋升是基于证据，不是基于一次主观判断
- 后续回看时可以追溯到原始事件

## 边界

- 不要把一次纠正直接晋升成长期规则
- 不要静默覆盖已有 skill 规则
- 不要跳过证据收集直接改写 skill
- 所有 proposal 都应该能追溯到原始事件

## 安装与运行

把这个 skill 放到 agent 运行时可见的 skill 目录，例如：

```text
~/.agents/skills/self-improvement
~/.claude/skills/self-improvement
~/.cursor/skills/self-improvement
<repo>/skills/self-improvement
```

最低要求：

- `README.md` 说明对外使用方式
- `SKILL.md` 说明 agent 执行规则
- `scripts/` 和 `.learnings/` 与 skill 本体放在一起

本地运行时，可以直接在 skill 目录下执行脚本，或用绝对路径调用。

## 测试

这个 skill 使用 Node 内置测试运行器，不依赖 Jest 或 Vitest。

在 skill 目录下执行：

```bash
npm test
```

当前单元测试覆盖：

- CLI 参数解析
- 日志文件路由
- pattern key 归一化与分组
- 晋升阈值过滤
- candidate Markdown 渲染

当前集成测试覆盖完整本地流程：

- 追加 learning event 到 `.learnings/events.jsonl`
- 同步写入 Markdown 日志
- 把重复事件归纳为 `patterns.json`
- 只把满足条件且近期出现的模式晋升到 `promotion_candidates.md`

## 后续可扩展方向

可以继续补充：

1. 冲突检测
2. patch proposal 生成器
3. 面向具体 skill 的效果对比
4. 验证通过后的写回流程

## 文件

- [SKILL.md](SKILL.md)：agent 侧执行规则
- [references/event-schema.md](references/event-schema.md)：事件字段定义
- [scripts/log-learning.js](scripts/log-learning.js)：事件记录脚本
- [scripts/distill-patterns.js](scripts/distill-patterns.js)：模式归纳脚本
