+++
title = "Vocabulary"
summary = "Definitions for Trellis concepts, terms, and specification vocabulary."
kicker = "Glossary"
+++

### Core Terms for the Trellis Format, Workflow, and Tooling Model

---

This glossary captures the recurring terms used across the Trellis whitepaper, workflow, and related site documents. It is meant to keep the project's language stable and precise.

## Agent Skill

The Trellis-aware instructions injected into an AI coding agent's workflow. The skill's job is to make the agent read relevant `.trellis` files before editing code, search for existing units before creating new ones, and update sidecars when intent changes.

## Architectural Substrate

The broader organizational role Trellis can play beyond unit-level intent capture. In this framing, the sidecar format becomes a polyglot layer on top of source code that can support architectural rules, ownership checks, dependency policies, and change analysis across languages.

## Body

The scenario section of a `.trellis` file. The body is written in a Gherkin-like style and describes concrete behaviors using tagged scenarios such as `happy-path`, `negative`, and `edge`.

## Consumes

The part of a sidecar's `Context` block that declares what a unit depends on. `Consumes:` entries are used to build the dependency graph, reason about coupling, and navigate from one unit to the units it relies on.

## Context

The structural section that sits under the `Feature:` declaration in a `.trellis` file. Trellis uses `Context` to record a unit's `Provides`, `Consumes`, `Invariants`, and `OutOfScope` boundaries.

## Dependency Graph

The graph built by the Trellis CLI from all `.trellis` files in a repository. Each sidecar is treated as a node, and each `Consumes:` entry becomes an edge. The graph supports navigation, impact analysis, duplicate detection, architectural policy checks, and other tooling.

## Drift

The condition where a sidecar and its source code no longer agree. Trellis uses the term for mismatches between intended behavior and actual behavior, stale metadata, or outdated dependency declarations.

## Drift Detection

The set of checks used to surface stale or misleading sidecars. In the Trellis documents, `@reviewed:` metadata and CI checks are the main mechanisms proposed for detecting when intent capture may have fallen behind the code.

## Edge Scenario

A scenario kind used for boundary conditions, concurrency cases, unusual inputs, and similar cases that sit outside the ordinary path but still matter to the unit's contract.

## Feature

The top-level declaration in a `.trellis` file. A `Feature:` names the unit and is followed by a mandatory one-sentence summary that gives humans and tools a quick description of the unit's purpose.

## Frontmatter

The machine-readable metadata at the top of a `.trellis` file. Trellis frontmatter uses `@`-prefixed fields such as `@owner`, `@stability`, `@composition`, `@since`, and `@reviewed`.

## Gherkin-like

The general style of the Trellis body syntax. Trellis borrows the readable `Given` / `When` / `Then` structure from Gherkin, but extends it with its own structural sections and scenario-kind tags.

## Happy-Path Scenario

A scenario kind used for the primary successful flow of a unit. It describes what should happen when the expected inputs and preconditions are satisfied.

## Invariants

The part of `Context` that declares rules that must always hold, across all scenarios. In Trellis, invariants are one of the most important sources of durable intent because they define what cannot be broken even when an implementation changes.

## Intent Capture

The central Trellis idea that a unit's purpose, boundaries, and constraints should be recorded explicitly in version control. Trellis treats this captured intent as a first-class artifact alongside code and tests.

## Language Server / LSP

The editor-facing tool proposed for Trellis. Its scope is intentionally narrow: validate sidecars, expose diagnostics, support navigation such as jump-to-definition on `Consumes:`, and provide small assists rather than generate code.

## Linter

The tool that enforces both Trellis format rules and design heuristics. The whitepaper describes it as a "super-linter" because it checks not only syntax and required sections, but also structural signals such as too many scenarios, too many dependencies, missing negative cases, or stale review metadata.

## Negative Boundaries

Trellis's name for explicit statements about what a unit must not do. `OutOfScope`, `MUST NOT`, and `SHALL NOT` clauses are valuable because they stop agents and developers from extending a unit in plausible but incorrect ways.

## Negative Scenario

A scenario kind that describes failure behavior, rejected inputs, or invalid conditions. The Trellis linter treats missing negative scenarios as suspicious because a specification that only describes success cases is usually incomplete.

## Orphaned Sidecar

A `.trellis` file whose source file no longer exists, or whose declared behavior is no longer connected meaningfully into the codebase. The dependency graph tooling is intended to help surface these cases.

## OutOfScope

The part of `Context` that declares what does not belong in the unit. This is a key Trellis term because it defines boundary lines explicitly and helps prevent duplication, overreach, and accidental responsibility creep.

## Policies

Declarative rule files stored under a repository or organization `policies/` directory. In the whitepaper, policies are where cross-cutting architectural rules would live so the linter can enforce them against the dependency graph.

## Polyglot

Describes Trellis's language-agnostic design. Because the sidecar format is not tied to Ruby, Go, Python, JavaScript, or any other single language, the same vocabulary and tooling can operate across mixed-language codebases.

## Provides

The part of a sidecar's `Context` block that declares what a unit offers to the rest of the system. `Provides:` entries are foundational to Trellis because they help humans and tools find existing capabilities before creating new ones.

## RFC 2119 Keywords

The normative vocabulary Trellis allows in invariants and scenario assertions: `MUST`, `MUST NOT`, `SHALL`, `SHALL NOT`, `SHOULD`, and `MAY`. These words let the spec express different levels of obligation and prohibition with standard technical language.

## Reviewed Date

The `@reviewed:` frontmatter field that records when a human last verified that a sidecar still reflects reality. It is a key part of the project's drift-detection story.

## Scenario Kind

The tag attached to a Trellis scenario, such as `happy-path`, `negative`, or `edge`. Scenario kinds give the linter and the agent a vocabulary for reasoning about completeness and balance within a feature.

## Sidecar

The `.trellis` file that sits next to a source file and describes that unit's intent. In Trellis, the sidecar is not just documentation; it is a structured artifact meant to be read by humans, agents, CI, and editor tooling.

## Stability

Usually expressed as the `@stability:` frontmatter field. It tells readers and tools how fixed or changeable a unit's contract is expected to be.

## Summary Line

The mandatory one-sentence description that follows `Feature:`. The Trellis documents treat this as one of the highest-leverage pieces of context because it helps an agent decide quickly whether the capability it needs already exists.

## Trait

A reusable behavioral or compositional concept claimed in frontmatter, typically through `@composition`. Traits let a unit declare that it participates in a shared contract or capability set.

## Trait Composition Coverage

The rule that a claimed trait should be reflected honestly in the sidecar's scenarios and constraints. In the linter design, Trellis treats missing coverage for a claimed trait as an error.

## Unit

The meaningful piece of source code that a `.trellis` sidecar describes. A unit might be a service object, class, module, function, worker, or similar coherent chunk of behavior.
