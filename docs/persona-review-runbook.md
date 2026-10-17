# Persona review runbook

The three installed files in `.claude/agents/` now include the approved Q01–Q06 corpus selections. These are synthetic judges, not human participants.

## Run after signing into Claude Code

From the product repository, authenticate with `claude auth login` if needed, then run each command separately:

```bash
claude --model sonnet --agent persona-maya -p 'Read docs/brand_position.md. Evaluate it using your persona output contract. Do not edit files. Return only the verdict JSON.' --tools Read --allowedTools Read
claude --model sonnet --agent persona-jordan -p 'Read docs/brand_position.md. Evaluate it using your persona output contract. Do not edit files. Return only the verdict JSON.' --tools Read --allowedTools Read
claude --model sonnet --agent persona-casey -p 'Read docs/brand_position.md. Evaluate it using your persona output contract. Do not edit files. Return only the verdict JSON.' --tools Read --allowedTools Read
```

Save actual outputs with the date and the tested commit. Review each `must_fix`, revise the brand position if warranted, and rerun. Scores are roleplay calibration, not survey results.

## October 17 status

Sign-in completed. The default-model runs hit a usage-credit limit; all three installed personas ran successfully with `--model sonnet`. See [actual outputs and test metadata](persona-reviews/2026-10-17/README.md). These replace the earlier sign-in blocker, not the distinction between synthetic feedback and human validation.

## OpenSpec

Initialized using `@fission-ai/openspec@1.14.3` for Claude Code with the core profile. Configuration is in `openspec/config.yaml`; generated commands and skills are in `.claude/`. Start a proposed feature with `/opsx:propose`. No application dependency or global CLI installation was added.
