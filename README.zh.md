# Pragmatic Agent Skills

一个面向真实任务、强调工程约束的开源 Agent Skill 仓库。

这个仓库只做一件事：沉淀可复用的 skills。它不是 prompt 大杂烩，也不是泛化的 AI 工具箱。

## 这个仓库为什么存在

很多公开 AI 仓库都有两个常见问题：

- 范围很大，但深度不够
- 看起来有用，但没有足够明确的执行细节，难以稳定复用

`Pragmatic Agent Skills` 反过来做：

- 每个 skill 都尽量窄、尽量具体
- 每个 skill 都明确触发条件和非目标
- 关键 fallback 行为会写清楚
- 只有在确实需要时，才附带脚本和模板

如果你在用 Cursor、Claude Code、Codex、Windsurf 或类似的 agent 系统，这个仓库的目标很直接：让你安装 skill 后得到稳定可复用的行为，而不是每周重复重写同一套工作方式。

## 这里目前有什么

当前 skills：

| Skill | 作用 | 值得关注的点 |
| --- | --- | --- |
| [JobJD-Greeting-Generator](skills/JobJD-Greeting-Generator/README.md) | 把 JD 和候选人信息压缩成一条可直接复制的招聘沟通话术 | `jd_url` 抓取有明确 fallback，不会一失败就让用户补全文 |
| [leetcode-coach](skills/leetcode-coach/README.md) | 把公开 coaching 逻辑和私有 LeetCode 记录彻底分开 | 共享规则与用户私有数据边界清晰 |
| [self-improvement](skills/self-improvement/README.md) | 记录使用过程中的教训，并蒸馏成 skill 改进候选项 | 能把重复纠正沉淀成可追溯的改进闭环 |

完整索引见 [skills/README.md](skills/README.md)。

## 设计原则

这个仓库里的每个 skill，都应该尽量满足这些标准：

1. 解决一个明确的问题
2. 明确说明什么时候该触发、什么时候不该触发
3. 优先写清楚可执行流程，而不是给模糊建议
4. 明确保护用户数据边界
5. 当信息不足时明确失败，而不是假装完成
6. 作为公开仓库内容仍然有独立价值，而不是只对作者本人有用

详细说明见 [docs/design-principles.md](docs/design-principles.md)。

## 快速开始

1. 从 [skills/README.md](skills/README.md) 里选一个 skill
2. 先读该 skill 的 `README.md`，理解公开契约
3. 再读 `SKILL.md`，理解 agent 侧执行规则
4. 如果 skill 自带脚本或模板，按同目录内容复用

上手说明见 [docs/getting-started.md](docs/getting-started.md)。

## 仓库结构

```text
.
├── skills/   # 对外公开的可复用 agent skills
├── docs/     # 仓库级原则、说明与路线图
└── tests/    # 针对部分 skill 的聚焦验证
```

## 为什么别人会想 Star

- 这些 skill 是能用的，不是只停留在概念上
- 仓库展示了怎样更干净地封装 agent 行为
- 示例都尽量贴近真实工作流
- 实现和文档都足够收敛，便于别人照着迁移

如果这个仓库以后能持续积累价值，原因应该是：这里的每个 skill 都是一小块真正可工作的基础设施。

## 贡献

欢迎提 Issue 或 PR，尤其是这几类改进：

- 提高清晰度
- 补强 fallback 行为
- 增加真实示例
- 增加验证
- 改善安装和接入体验

贡献说明见 [CONTRIBUTING.md](CONTRIBUTING.md)。
