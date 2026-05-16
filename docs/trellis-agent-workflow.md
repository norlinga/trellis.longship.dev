---
title: "Trellis Agent Workflow"
summary: "A statement of who Trellis is for, how an AI-assisted workflow around it operates, and why that workflow is more productive and safer than ordinary agent-driven coding."
kicker: "Workflow"
url: "/agent-workflow/"
---

# Trellis Agent Workflow

## Who Trellis Is For

Trellis is not a tool for teams that want the appearance of discipline without the practice of it.

It is not for people who use whatever tool they are told to use, generate whatever code they are told to generate, and move on. It is not for those who treat the codebase as a dumping ground for output or who think speed alone is competence.

Trellis is for people who care.

It is for developers who want to cultivate a codebase rather than shovel more slop into it. It is for engineers who think stewardship matters. It is for the code boy scouts: the people who want to leave the system better than they found it. It is for artisans rather than transcribers.

That means Trellis asks something of its user. It requires attention, judgment, and a willingness to keep intent explicit rather than implicit.

The wager behind Trellis is that this investment returns far more than it costs.

## The Basic Thesis

AI-assisted coding becomes dangerous when it is fast enough to be useful but not disciplined enough to preserve intent.

An ordinary coding agent can often produce locally plausible code. That is not the same as producing globally coherent software. The common failures are recognizable:

- duplicate units instead of extending existing ones
- needless rewrites of working code
- drift between what a unit was meant to do and what it now does
- erosion of architecture through a series of individually plausible local changes

The problem is usually not that the agent cannot write code. The problem is that it does not carry enough durable, local, reviewable intent into the moment of change.

Trellis exists to change that.

## What Trellis Adds

Trellis gives each meaningful unit a sidecar specification that an agent can read before it acts.

That sidecar tells the agent:

- what the unit is for
- what it provides
- what it consumes
- what invariants must hold
- what is explicitly out of scope

This changes the role of context. Instead of forcing the agent to reconstruct design intent from raw source, scattered comments, vague project docs, and whatever files happened to be retrieved, Trellis puts a deliberate, local statement of intent next to the code itself.

The result is not merely better documentation. It is a constraint system for change.

## A Plausible Workflow

A Trellis-aware AI workflow is easy to imagine.

1. A developer asks the agent to make a change.
2. The agent identifies the relevant units.
3. Before touching code, the agent reads the relevant `.trellis` files.
4. The sidecars tell the agent what belongs in those units, what dependencies already exist, what must remain true, and what belongs elsewhere.
5. The agent decides whether the work belongs in an existing unit or requires a new one.
6. The agent drafts code changes, test changes, and sidecar changes together.
7. Review happens against code and intent at the same time.
8. CI or tooling checks for drift, stale review metadata, or sidecars that were not updated when the code changed materially.

This is a more disciplined loop than the default prompt-to-diff workflow most AI coding currently relies on.

## Why It Is More Productive

Trellis can make an AI workflow more productive not because it removes thought, but because it removes wasted motion.

An agent working without Trellis spends time:

- searching for the right unit
- misunderstanding ownership boundaries
- inferring hidden contracts from implementation details
- introducing overlap with existing behavior
- making changes that later have to be corrected in review

An agent working with Trellis gets high-value context immediately.

`Provides` and `Consumes` reduce search and architectural guesswork. `Invariants` reduce behavioral ambiguity. `OutOfScope` reduces overreach. The agent is less likely to solve the wrong problem in the wrong place.

That means:

- fewer duplicate modules
- fewer unnecessary rewrites
- clearer extension paths
- less review time spent reconstructing intended behavior
- less time lost to plausible but misaligned diffs

The productivity gain comes from better targeting, not from writing more code per minute.

## Why It Is Safer

The safety case is stronger than the productivity case.

Without Trellis, an AI agent usually works from a prompt, some retrieved source files, perhaps some tests, and whatever institutional intent happens to be latent in the repository. That is enough to make useful changes, but not enough to reliably preserve the design character of the system.

Trellis makes the constraints explicit before change begins.

- `Provides` says what this unit is responsible for.
- `Consumes` says what external relationships already define it.
- `Invariants` say what must not be broken even if the happy path still appears to work.
- `OutOfScope` says where the agent is not allowed to be “helpful.”

This matters because the most common unsafe behavior in coding agents is not random failure. It is over-eager completion. The agent sees a nearby place to add behavior, does so plausibly, and quietly weakens the design.

Trellis introduces negative boundaries, not just positive descriptions. That is one of its most important safety properties.

## What A Strong Trellis Workflow Would Enforce

The strongest version of this model would make Trellis part of the operating discipline of AI-assisted development:

- the agent must read relevant `.trellis` files before editing code
- the agent must justify creating a new unit against existing sidecars
- pull requests should include sidecar diffs when intent or contract changes
- CI should flag stale `@reviewed` metadata and suspicious code-only changes
- architecture checks should be derivable from `Provides` and `Consumes`
- reviewers should inspect intent drift explicitly rather than infer it from code alone

At that point, Trellis becomes more than a format. It becomes a workflow substrate.

## The Deeper Distinction

A conventional AI coding workflow asks:

**Can the agent produce code that works?**

The Trellis workflow asks:

**Can the agent change the system without forgetting what the system is for?**

That is the more serious question.

Software quality is not only about passing tests or satisfying the local request. It is also about preserving responsibility boundaries, honoring existing invariants, resisting duplication, and keeping a system legible over time.

Trellis is designed for people who believe those things still matter, even when code generation becomes cheap.

## Final Claim

Trellis is a tool for those who care enough to make intent explicit.

It asks for discipline, but not discipline as ceremony. It asks for discipline as leverage. If the sidecars are maintained well, and if the tooling around them is integrated tightly with AI agents, the result is a workflow that is both more productive and safer than ordinary agent-driven coding.

It is more productive because it reduces wasted search, duplicate effort, and misaligned implementation.

It is safer because it constrains the agent with durable, local, version-controlled intent before the code changes are made.

That is the promise of Trellis: not merely faster coding, but more careful software under conditions of accelerated change.
