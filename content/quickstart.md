---
title: "Installation & Quickstart"
summary: "The fastest way to try Trellis in a real codebase: install the CLI, add the agent skill, write one sidecar, use it on one real change."
kicker: "Quickstart"
url: "/quickstart/"
---

## Install the CLI

The `trellis` CLI is a Go application that serves as the tooling layer for working with sidecars: it builds the dependency graph, runs the linter, and powers the pre-creation and pre-modification checks that the agent skill relies on.

If you have Go installed:

```text
go install github.com/norlinga/trellis@latest
```

Alternatively, download a pre-built binary for your platform from the [GitHub releases page](https://github.com/norlinga/trellis/releases).

Once installed, verify it:

```text
trellis --version
```

Full installation docs and release notes are at the [GitHub repository](https://github.com/norlinga/trellis). If you are reading this before the first stable release, watch the repo for announcements.

The key commands you will use most:

```text
trellis graph search "create subscription"   # find existing units before creating new ones
trellis graph deps app/services/my_service.rb  # what depends on this file
trellis lint                                   # check all sidecars for format and design issues
```

## Install the Agent Skill

The agent skill is a short behavioral document that shapes how your AI coding assistant interacts with Trellis-aware code. It enforces the workflow gates — checking for duplicate features before creating new files, reading sidecars before modifying files, and surfacing invariant violations before writing code.

Download [TRELLIS_SKILL.md from the Trellis repository](https://github.com/norlinga/trellis/blob/main/skill/TRELLIS_SKILL.md) and add it to your project. For Claude Code, place it in your project's `.claude/` directory or reference it from your `CLAUDE.md`. For other agents, follow that agent's skill injection documentation.

The skill is short by design. Its job is not to describe Trellis — it is to give the agent a specific checklist it runs before every meaningful action.

## Start Small

You do not need to sidecar your entire codebase before Trellis is useful. A single `.trellis` file next to a single source file is already useful if it helps a reviewer or an agent understand what that unit is for before touching it.

The right first experiment: apply Trellis to one meaningful unit, on one real change, and see whether the sidecar improves the quality of the work.

If you want the full conceptual case, read the [whitepaper](/whitepaper/). If you want the shortest plausible experiment, continue here.

## What You Need

You need:

- the `trellis` CLI installed
- the agent skill in place for your AI assistant
- one codebase with a unit that matters
- one real upcoming change, bug fix, or extension
- one human willing to review whether the sidecar is honest

That is enough to begin.

## Pick One Unit

Choose a unit that already has a recognizable responsibility:

- a service object
- a class with a narrow job
- a module with a stable public function
- a worker or job with a clear contract

Do not begin with the most chaotic file in the system. Trellis works best when the first example is coherent enough to teach the format well.

## Create The Sidecar

Before creating a new unit, let the CLI check whether something similar already exists:

```text
trellis graph search "create subscription"
```

If nothing matches, create the source file and its sidecar together. The sidecar lives next to the source file with `.trellis` appended:

```text
app/services/create_subscription.rb
app/services/create_subscription.rb.trellis
```

Write the sidecar first. Keep it small and honest. The goal is not to describe every implementation detail. The goal is to capture intent, boundaries, and constraints.

```gherkin
@owner: BillingTeam
@stability: stable
@since: 2026-05-16
@reviewed: 2026-05-16

Feature: Create Subscription

  "Creates a user's subscription and charges the initial payment method."

  Context:

    Provides:

      - Subscription.create(user, plan_id) -> Subscription | raises PaymentError

      - Event: subscription.created

    Consumes:

      - PaymentGateway.charge(token, amount) -> ChargeResult

      - UserRecord (must respond to: id, email, payment_token)

    Invariants:

      - A user MUST NOT have two active subscriptions for the same plan

      - Charges SHALL be idempotent on (user_id, plan_id, idempotency_key)

    OutOfScope:

      - Refunds

      - Plan upgrades

  Scenario (happy-path): Successful subscription creation

    Given a user with a valid payment token

    When subscription creation is requested for a plan

    Then a Subscription record is created

    And the payment gateway is charged

  Scenario (negative): Declined card

    Given a user with a declined payment method

    When subscription creation is requested

    Then it MUST raise PaymentError

    And no Subscription record is created
```

## Keep Four Questions In Mind

When writing the first sidecar, ask:

1. What does this unit provide to the rest of the system?
2. What does it consume or rely on?
3. What must remain true even if the implementation changes?
4. What does not belong here?

If you answer those four questions clearly, the sidecar will already be useful.

## Use It During A Real Change

The quickstart is not complete when the file exists. It is complete when the file changes how work gets done.

Take one real task and use the sidecar before editing code:

1. Read the sidecar in full.
2. Check whether the requested change belongs inside the unit's stated scope.
3. If the change touches an `Invariant`, decide explicitly whether the invariant is being preserved or changed.
4. If the change adds a dependency, update `Consumes:`.
5. If the change alters the contract or boundaries, update the sidecar in the same pull request.
6. Update the `@reviewed:` date.

Then run the linter to catch any format or design issues:

```text
trellis lint app/services/create_subscription.rb.trellis
```

This is the important moment. Trellis is useful only if it affects decisions before code is written.

## What Good Looks Like

Your first Trellis experiment is successful if it produces any of the following:

- the agent extends an existing unit instead of creating a duplicate
- a reviewer spots an intent drift that would have been easy to miss in code alone
- the sidecar clarifies that a requested change is actually out of scope
- a test plan becomes clearer because the invariants are explicit
- the unit's dependencies become easier to reason about

The win is not ceremony. The win is better targeting and better restraint.

## What To Avoid

Common failure modes for the first attempt:

- writing implementation notes instead of intent
- documenting every private detail
- inventing invariants that are not actually enforced
- leaving `OutOfScope:` empty when the boundary is important
- treating the sidecar as complete once created, even though the code changed

The sidecar should be concise, reviewable, and slightly abstracted from the source. If it merely paraphrases the code line by line, it is not doing the job.

## Suggested First Rollout

If the first unit is useful, expand slowly:

1. Add sidecars to a few high-value units in one subsystem.
2. Require agents to read those sidecars before modifying those files.
3. Review code and sidecar diffs together.
4. Run `trellis lint` in CI.
5. Start watching for duplicate features, weak boundaries, and stale intent.
6. Only later add graph policy enforcement to the workflow.

The adoption path is intentionally file-by-file, not all-at-once.

## Tooling Status

The format and the agent skill workflow can be tried immediately. The broader tooling is being built in this sequence:

1. format specification — *available now*
2. tree-sitter parser — *in development*
3. dependency graph CLI — *in development*
4. linter — *in development*
5. language server — *planned*
6. agent skill — *available now at [GitHub](https://github.com/norlinga/trellis/blob/main/skill/TRELLIS_SKILL.md)*
7. policy packs — *planned*

That sequencing matters. The format should prove useful before the surrounding tools become large.

## Next Reading

- Read the [whitepaper](/whitepaper/) for the full argument and tooling model.
- Read the [FAQ](/faq/) for the strongest objections and the honest residual concerns.
- Use the [glossary](/glossary/) if you want precise definitions for terms like `Invariants`, `OutOfScope`, `Provides`, and `Consumes`.
- Download the [agent skill](https://github.com/norlinga/trellis/blob/main/skill/TRELLIS_SKILL.md) and add it to your project.
- Watch the [GitHub repository](https://github.com/norlinga/trellis) for implementation progress and release announcements.
