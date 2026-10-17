# Persona review runbook

The three installed files in `.claude/agents/` now include the approved Q01–Q06 corpus selections. These are synthetic judges, not human participants.

## Run after signing into Claude Code

From the product repository, authenticate with `claude auth login` if needed, then run each command separately:

```bash
claude --agent persona-maya -p 'Read docs/brand_position.md. Evaluate it using your persona output contract. Do not edit files. Return only the verdict JSON.' --tools Read --allowedTools Read
claude --agent persona-jordan -p 'Read docs/brand_position.md. Evaluate it using your persona output contract. Do not edit files. Return only the verdict JSON.' --tools Read --allowedTools Read
claude --agent persona-casey -p 'Read docs/brand_position.md. Evaluate it using your persona output contract. Do not edit files. Return only the verdict JSON.' --tools Read --allowedTools Read
```

Save actual outputs with the date and the tested commit. Review each `must_fix`, revise the brand position if warranted, and rerun. Scores are roleplay calibration, not survey results.

## October 17 status

`claude auth status` returned `loggedIn: false`, so fresh inference runs were not performed. Do not relabel the earlier October 9 review notes as results against the new document. Installation and file synchronization are complete on this branch; execution remains blocked on sign-in.

## OpenSpec

Initialized using `@fission-ai/openspec@1.14.3` for Claude Code with the core profile. Configuration is in `openspec/config.yaml`; generated commands and skills are in `.claude/`. Start a proposed feature with `/opsx:propose`. No application dependency or global CLI installation was added.
