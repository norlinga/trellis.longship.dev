---
title: "Trellis"
summary: "The core conceptual whitepaper for Trellis: the problem, the format, the tooling model, and the architectural case."
kicker: "Whitepaper"
url: "/whitepaper/"
---

### A Specification Format and Tooling Layer for Keeping AI-Assisted Codebases on the Rails

---

## Abstract

Trellis is a proposed specification format, language server, and tooling layer designed to address a class of failures emerging in large codebases — particularly, though not exclusively, those produced with AI coding assistants. It pairs each unit of source code with a sidecar file written in a Gherkin-inspired dialect: the body in human-readable Given/When/Then prose, the frontmatter and structural sections in machine-readable form. The goal is not to replace tests or documentation, but to make the *intent* of each unit a first-class, queryable, version-controlled artifact that both humans and AI agents can reason against before writing code.

Because the format is uniform across source languages, a Trellis-aware codebase gains a second, equally important property: a polyglot substrate for expressing and enforcing architectural and organizational design rules that conventional linters — bound to single-language syntax trees — cannot reach. The same artifact that keeps an AI agent disciplined within a unit also lets an organization enforce layer boundaries, bounded contexts, ownership, and stability tiers across an entire engineering portfolio.

This document describes the problem Trellis is designed to solve, the philosophical stance behind the format, the proposed format itself, the tooling that surrounds it, the specific mechanisms by which it keeps AI-driven workflows disciplined, and the broader role it can play as an architectural substrate for an engineering organization.

---

## 1\. The Problem

Codebases developed with AI assistance scale differently than codebases developed by humans alone. The early gains from AI assistance are real — features ship faster, boilerplate dissolves, refactors that would have taken a week take an afternoon. But as the codebase grows past a certain threshold, a different cost begins to accumulate, and it accumulates faster than in human-only codebases.

The cost takes a few recognizable shapes:

- **Duplicate features.** An agent, asked to add functionality, writes a new module rather than extending an existing one — because it didn't know the existing one was there, or because finding it would have required reading more of the codebase than it could economically reason about.  
- **Needless rewrites.** An agent, asked to modify behavior, rewrites a working unit rather than amending it, often introducing regressions in the process.  
- **Drift between intent and code.** What the system was supposed to do and what the system does diverge over time, and there is no artifact in the repository that anchors the original intent.  
- **Loss of architectural discipline.** Single Responsibility Principle, dependency direction, separation of concerns — the things a senior human developer enforces by reflex erode silently when each change is made by an agent operating with limited context.

The unifying cause is that AI agents lack the discipline a competent human developer brings — not because they cannot reason about good design, but because they cannot economically reload the full context of a large system on every change. They make locally reasonable decisions that aggregate into globally bad outcomes.

Existing approaches to this problem are partial. Tests catch behavioral regressions but not duplication or design erosion. Documentation drifts. AGENTS.md files and project rules help, but operate at the project level rather than the unit level, so they do not give an agent specific context about *this file* before it modifies *this file*. Spec-Driven Development (SDD) frameworks like GitHub Spec Kit, Kiro, and OpenSpec address part of the problem at the feature level, but treat specifications as separate artifacts under a `specs/` directory rather than as unit-level companions to source files.

Trellis is an attempt to fill the gap at the unit level — to give every meaningful piece of the system a small, structured, opinionated companion file that an agent reads before it acts.

There is a parallel problem, equally old and equally underserved, that the same artifact happens to address. Conventional linters reason about the syntax tree of a single language; they cannot enforce rules that live above the file or module level, and they cannot reason at all across language boundaries. Most organizational design guidelines — layer boundaries, bounded contexts, ownership, stability tiers, dependency direction — live precisely in that blind spot. They get enforced by code review, reviewer vigilance, and prayer, and they erode silently over years. A uniform sidecar format with structured `Provides:` and `Consumes:` declarations makes those rules mechanically enforceable across any language, because the substrate the rules operate on is no longer the source code but the sidecars. This dimension is developed in §6.

---

## 2\. The Philosophical Stance

Trellis rests on a separation of concerns between three artifacts that today are often conflated:

- **The specification** is **idealization and intent**. It describes what the unit *should be*, in language abstracted from implementation. It is permissive about how, strict about what.  
- **The tests** are **adversarial verification**. They are binary, executable, and unforgiving. They affirm or deny that the system meets its stated intent. They do not describe; they interrogate.  
- **The code** is the **embodiment** of the two. It exists to satisfy the tests, in service of the specification. It is, in a meaningful sense, the most disposable of the three artifacts: when the spec and tests are good, the code can be regenerated.

This three-way separation is not merely organizational. It is the mechanism by which Trellis intends to keep agents honest. Each artifact constrains the others:

- The spec constrains the tests: tests outside the spec's scope are noise; tests that fail to cover the spec's invariants are inadequate.  
- The tests constrain the code: code that fails the tests is wrong by definition.  
- The code constrains the spec: a spec that cannot be satisfied by any implementation is broken.

When the three disagree, the discipline of Trellis is to make the disagreement explicit and resolve it deliberately rather than letting one silently overwrite another.

---

## 3\. The Format

A Trellis sidecar file lives alongside its source file with the suffix `.trellis` appended:

/app/services/create\_subscription.rb

/app/services/create\_subscription.rb.trellis

The format has three sections: **frontmatter**, **header**, and **body**.

### 3.1 Frontmatter

Frontmatter is machine-readable metadata, prefixed with `@`, intended for tooling rather than human consumption — though it is human-legible:

@owner: BillingTeam

@stability: stable

@composition: \[Authenticatable, Payable\]

@since: 2025-11-04

@reviewed: 2026-03-15

Frontmatter answers: who owns this, how stable is its contract, what reusable traits does it claim, when was it introduced, and when did a human last verify the sidecar reflects reality. The `@reviewed` field in particular is load-bearing — it is the basis for drift detection in CI.

### 3.2 Header — The Feature Block and Its Context

The header opens with a `Feature:` declaration and a mandatory one-sentence summary in quotes. The summary is enforced — it is the highest-leverage piece of context an agent can read before deciding whether a new unit it is about to write already exists.

Feature: Create Subscription

  "Handles the idempotent creation of a user subscription and initial billing."

Following the feature declaration is the `Context` block, which captures the *structural* facts about the unit's place in the system. This is distinct from Gherkin's `Background:`, which captures shared test setup. Context is divided into four sub-blocks:

  Provides:

    \- Subscription.create(user, plan\_id) \-\> Subscription | raises PaymentError

    \- Event: subscription.created

  Consumes:

    \- PaymentGateway.charge(token, amount) \-\> ChargeResult

    \- UserRecord (must respond to: id, email, payment\_token)

  Invariants:

    \- A user MUST NOT have two active 'pro' subscriptions

    \- Charges SHALL be idempotent on (user\_id, plan\_id, idempotency\_key)

  OutOfScope:

    \- Refunds (handled by RefundService)

    \- Plan upgrades (handled by ChangeSubscriptionPlan)

The split between `Provides:` and `Consumes:` is deliberate and structural. Together they make the entire codebase's dependency graph queryable from the sidecars alone, without parsing source code in any specific language. This is the foundation on which most of Trellis's tooling leverage is built.

`Invariants:` captures rules that must hold across all scenarios. RFC 2119 keywords (MUST, SHALL, SHOULD, MAY, MUST NOT, SHALL NOT) are permitted and encouraged here. The negative forms — MUST NOT, SHALL NOT — are particularly valuable, because they specify *what the unit is not allowed to do*, which prevents agents from "helpfully" adding behavior that was never requested.

`OutOfScope:` is similarly negative-space specification. It tells an agent considering adding behavior to this unit: "no, that belongs elsewhere." It is one of the most effective anti-duplication mechanisms in the format, because it forces an explicit decision about boundaries at the moment they are most easily drawn.

### 3.3 Body — Scenarios

The body uses a Gherkin-inspired syntax for scenarios, with a small extension: each scenario is tagged with a *kind*.

  Scenario (happy-path): Successful checkout

    Given a User with a valid 'stripe\_token'

    When the 'create' method is called with 'plan\_id'

    Then a Subscription record is created

    And the PaymentGateway receives a 'charge' request

    And the User's 'status' becomes 'active'

  Scenario (negative): Expired card

    Given a User with an expired card

    When the 'create' method is called

    Then it MUST raise 'PaymentError'

    And no Subscription record is created

  Scenario (edge): Concurrent creation with same idempotency key

    Given two simultaneous 'create' calls with identical idempotency keys

    When both are processed

    Then exactly one Subscription record exists

    And both callers receive the same Subscription

The kind tags — `happy-path`, `negative`, `edge`, and a small fixed set of others — give the linter and the agent skill a vocabulary for completeness checks. A Feature with no `negative` scenarios is suspicious. A Feature with twenty `happy-path` scenarios is almost certainly violating Single Responsibility.

RFC 2119 keywords are permitted inside `Then` steps. They function as syntactic sugar for the linter and CI: a `MUST` clause that fails a test is a build break; a `SHOULD` clause that fails is a warning. This gives writers a way to express graduated importance without leaving the format.

---

## 4\. The Tooling

The format alone is inert. The leverage comes from a small, opinionated set of tools that consume it.

### 4.1 The Dependency Graph

The first and most foundational tool is a CLI that parses every `.trellis` file in a workspace and constructs a graph: each sidecar is a node, each `Consumes:` entry is an edge. This graph is the substrate for almost everything else Trellis does.

With the graph, the following queries become trivial:

- **What depends on this unit?** Every sidecar whose `Consumes:` references this unit's `Provides:`.  
- **What does this unit depend on?** Direct read of `Consumes:`.  
- **What would break if I changed this signature?** Transitive closure of dependents.  
- **Are there orphaned sidecars?** Sidecars whose source file no longer exists, or whose `Provides:` is unreferenced.  
- **Are there duplicate features?** Sidecars whose summary lines are semantically similar above a threshold.

The graph is intentionally a separate, runnable artifact — not embedded in an LSP — so that it can be used in CI, in scripts, and as input to the agent skill.

### 4.2 The Linter (Super-Linter)

The linter enforces both the format and a set of design rules. The format rules are mechanical: required sections present, frontmatter well-formed, scenarios tagged with valid kinds. The design rules are the nudges:

| Rule | Threshold | Rationale |
| :---- | :---- | :---- |
| Scenario count per Feature | warn at 10, error at 15 | SRP proxy; high counts indicate the unit does too much |
| `Consumes:` count | warn at 5, error at 8 | Coupling proxy; high counts indicate a coordinator that should be split |
| Verb diversity in `Provides:` | warn at 5+ distinct verbs | God-object proxy; many unrelated verbs indicate poor cohesion |
| Missing `negative` scenario | warn | Incomplete behavioral specification |
| Empty `Invariants:` block | warn | Often a sign the spec is just transcribing the code rather than abstracting over it |
| `@reviewed:` older than N months | warn at 6, error at 12 | Drift detection |
| Trait composition coverage | error if claimed trait's contract is uncovered | Honest composition |
| Duplicate `Provides:` across files | error | Catches accidental duplicate features at write time |

Each design rule supports an explicit, justified override (for example, `@allow-many-scenarios: "this is a state machine with N legitimate states"`). The override is itself a documentation artifact — and the friction of writing it is the nudge.

### 4.3 The Language Server

The LSP is deliberately scoped down. Its job is navigation, validation, and small assists — not code generation, not test execution.

- **Schema and syntax validation** as you type  
- **Jump-to-definition** on `Consumes:` entries — opens the consumed unit's `.trellis` file  
- **Hover documentation** — the summary line of any referenced unit or trait  
- **Diagnostics** surfaced from the linter  
- **One code action**: "Generate scenario stub from `Provides:` signature"

The LSP is small because the value is in the graph and the linter. The LSP simply makes those tools feel native in the editor.

### 4.4 The Agent Skill

The piece that closes the loop is a skill injected into the agent's working set — a short, behavioral document that shapes how the agent interacts with the Trellis-aware codebase. Its core is a workflow gate:

**Before creating any new file under a managed directory, you MUST:**

1. Run `trellis graph search "<verb-noun of intended addition>"` to find existing units with similar `Provides:` entries.  
2. If any match exceeds 70% semantic similarity, STOP and surface the match to the user with the question: "This appears related to `<existing unit>`. Should I extend it instead of creating new?"  
3. If creating new is confirmed, write the `.trellis` file FIRST and surface it for review before writing implementation.  
4. After implementation passes tests, update the `@reviewed:` date on the sidecar.

**Before modifying any existing file, you MUST:**

1. Read its `.trellis` file in full.  
2. If your change is in the `OutOfScope:` section of that file, STOP and ask whether the boundary is being intentionally moved.  
3. If your change violates an `Invariant:`, STOP and ask whether the invariant is being intentionally weakened.  
4. If your change adds a `Consumes:` entry, verify the consumed unit exists and surfaces the new dependency to the user.

This is a short skill — a page or two — but it is the entire churn-prevention mechanism, expressed as a checklist the agent runs against the artifacts the rest of the system produces.

---

## 5\. How This Keeps AI Workflows On the Rails

Trellis does not prevent agents from making mistakes. It does something more modest and more useful: it raises the cost of making the *specific kinds* of mistakes that compound badly in long-running AI-assisted projects.

**Duplication is suppressed at write time.** An agent that runs the workflow gate cannot create a duplicate feature without acknowledging the existing one. The check is cheap because the graph is cheap.

**Rewrites become amendments.** An agent reading the existing sidecar before modifying the source has a higher-fidelity model of what the unit is supposed to do than it would by reading the code alone. The sidecar's `Invariants:` and `OutOfScope:` blocks make the boundaries of acceptable change explicit.

**Drift is visible.** The `@reviewed:` timestamp ages out of date. CI surfaces it. The aging artifact is the forcing function.

**Architectural discipline is encoded as friction.** The linter's design rules push back, in the moment, against the patterns that erode codebases — too-large units, too-coupled units, god objects, partial abstractions. The pushback is rule-based rather than judgment-based, but the rules are calibrated to mirror what a senior reviewer would flag.

**Negative space is specifiable.** `OutOfScope:`, `MUST NOT`, and `SHALL NOT` give writers a vocabulary for what the unit deliberately does not do. This is the single most effective tool against the "helpful agent" failure mode — the one where the agent adds plausible-looking but unrequested behavior.

**Tests have an anchor.** The sidecar tells the test author (human or agent) what to test. The tests' job is to verify the sidecar's claims adversarially. When sidecar and code disagree, the test is the tiebreaker: either it catches the disagreement (and code is wrong) or it doesn't (and the sidecar is wrong, prove it by writing the test that should have caught it).

---

## 6\. Trellis as Architectural Substrate

The mechanisms in §5 keep agents disciplined within a codebase. The format has a second property — a structural one, not a feature added on — that operates at a higher level: it is a polyglot substrate for expressing and enforcing architectural and organizational design rules.

Conventional linters reason about the syntax tree of a single language. ESLint understands JavaScript. RuboCop understands Ruby. They are excellent at language-local concerns and structurally incapable of anything else. This is why most organizations have rich linting for individual files and almost no mechanical enforcement of the rules that actually matter at scale: layer boundaries, bounded contexts, ownership, dependency direction, stability tiers. These rules apply equally to the Rails service in Ruby, the worker in Python, and the API gateway in Go — but no linter sees all three.

A Trellis-aware codebase has a uniform sidecar format attached to every meaningful unit, regardless of language. The dependency graph constructed from `Provides:` and `Consumes:` declarations is polyglot by construction. The linter rules in §4.2 — too many consumers, too many verbs, missing invariants — apply identically to a Rust binary and a Ruby on Rails app, because they operate on the sidecar, not the source. This is not an enhancement to add later; it is what the format is.

### 6.1 Capabilities Unique to a Sidecar Substrate

Several enforcement patterns become available that no conventional toolchain offers as a unified package:

**Cross-language dependency rules.** A policy that the Python ML service may not consume from the Ruby billing domain becomes a graph query: any sidecar in `services/ml/` whose `Consumes:` references anything in `app/billing/` is a build break. The rule is written once, in the organization's policy file, and it holds across any language anyone introduces tomorrow.

**Architectural layer enforcement.** Hexagonal architecture, clean architecture, ports-and-adapters all have rules about which layers may depend on which other layers. These rules are notoriously hard to enforce because they rely on developer discipline and reviewer vigilance. With Trellis, layers are declared as frontmatter (`@layer: domain`, `@layer: infrastructure`), and the linter rejects any `Consumes:` edge that crosses a layer boundary in the wrong direction. The kind of rule that erodes silently over years becomes a build break that prevents the erosion.

**Bounded context boundaries.** Domain-Driven Design's bounded contexts are real, important, and almost never enforced mechanically. A `@context: billing` tag plus a policy that contexts only communicate through declared integration points is sufficient to make the architecture survive contact with new developers who haven't read the DDD book.

**Stability tier enforcement.** A rule that `@stability: stable` units cannot consume from `@stability: experimental` units (with the reverse permitted) prevents experimental code from becoming load-bearing-by-accident — a depressingly common failure mode in fast-moving codebases.

**Ownership-aware change analysis.** The dependency graph combined with `@owner:` frontmatter answers "what teams are affected by this change" and "is this PR touching code owned by a team not represented in the reviewers" — both organizationally important, both currently approximated by GitHub CODEOWNERS files that operate at directory granularity rather than dependency granularity.

**Drift dashboards at organizational scale.** Aggregated `@reviewed:` timestamps across a portfolio of services answer: which parts of which systems have unverified specs, sorted by ownership, sorted by criticality. This is the kind of visibility that engineering leadership currently has to manufacture from incomplete sources.

### 6.2 Policies as First-Class Artifacts

Architectural rules deserve to live in the repository alongside the code they govern, versioned together, reviewable as artifacts in their own right. Trellis treats them this way through a `policies/` directory at the repo or organization root, holding declarative rule files the linter consumes:

\# policies/architecture.trellis-policy

layer\_dependencies:

  \- domain MUST NOT consume infrastructure

  \- application MAY consume domain

  \- infrastructure MAY consume domain

context\_isolation:

  \- billing MUST NOT consume directly from identity

  \- billing MAY consume identity.public\_api

stability\_tiers:

  \- stable MUST NOT consume experimental

These policies evolve with the codebase. An architectural decision that today lives in a Confluence page nobody reads becomes a file that fails the build when violated. The decision is not lost; it is enforced.

### 6.3 Policy Packs

A natural extension is the **policy pack**: a reusable bundle of rules an organization maintains centrally and imports into individual repos. A company-wide pack defines the rules every service must follow; individual services may extend the pack but not override its prohibitions. This is the mechanism by which Trellis scales from "useful in one codebase" to "useful across an engineering organization." The same substrate that disciplines a single repository disciplines a portfolio.

### 6.4 Two Audiences, One Artifact

The dimension developed here matters for adoption. The unit-level AI-discipline framing speaks to individual developers and small teams; the architectural-substrate framing speaks to staff engineers, architects, and engineering leaders who today are paid to worry about exactly these problems and have only weak tools for solving them. Both audiences read the same `.trellis` files, run the same linter, and consume the same graph. The format does not bifurcate; the value proposition does.

A team adopting Trellis purely for AI-coding hygiene gets architectural enforcement for free as the codebase grows. An organization adopting Trellis purely for cross-language architectural enforcement gets AI-coding hygiene for free as agents enter the workflow. Each audience can adopt for the reason that matters to them and discover the other benefit later.

---

## 7\. What Trellis Is Not

It is worth being explicit about scope, because the temptation in this design space is to grow until the format collapses under its own weight.

- **Trellis is not BDD.** It borrows Gherkin's surface syntax for scenarios because it is the most readable structured prose format available, but Trellis sidecars are not executed. They are not test files. They inform tests; they do not replace them.  
- **Trellis is not a code generator.** The agent generates code, using the sidecar as input. The format does not prescribe an implementation, and the LSP does not synthesize one.  
- **Trellis is not a replacement for project-level documentation.** AGENTS.md, READMEs, ADRs, and architectural docs all retain their roles. Trellis operates at the unit level; project-level concerns live elsewhere.  
- **Trellis is not a workflow framework.** It is a format and a tooling layer. It composes with whatever workflow — Spec Kit, Kiro, custom coordinators — a team already runs. Its job is to be useful inside any of them.

---

## 8\. Implementation Sequence

A pragmatic build order, in roughly increasing surface area:

1. **The format spec** — a small, complete grammar with examples, edge cases, and a deliberate refusal to grow.  
2. **A tree-sitter parser** — the substrate for everything else.  
3. **The dependency graph CLI** — a standalone tool that answers the queries in §4.1. Useful immediately, even before any other piece exists. Dogfood here.  
4. **The linter** — built on the graph and the parser. Format rules first, then design rules, calibrated against real codebases. Policy-file consumption (§6.2) follows once the rule vocabulary has stabilized.  
5. **The LSP** — once the graph and linter are stable, the editor integration is mostly plumbing.  
6. **The agent skill** — written last, because by this point the underlying tools are stable enough to be referenced by name in the skill's instructions.  
7. **Policy packs** — the organizational layer (§6.3) is the final addition, built on a stable single-repo foundation.

The graph CLI is the highest-leverage early artifact. Even without an LSP, a skill, or a policy system, a tool that answers "what depends on this," "what does this depend on," and "what's drifted" is immediately useful. It also lets the format itself be tested against a real codebase before downstream tooling locks in any decisions.

---

## 9\. Closing

Trellis is a specific bet, and it has two faces.

The first: that the failure modes of AI-assisted development at scale are not failures of model capability but failures of *available context*, and that the right unit of context is the unit of code itself. Each `.trellis` file is small. The vocabulary is small. The tooling is small. The discipline they enforce, taken together, is the discipline that keeps codebases coherent over time — discipline that AI agents are perfectly capable of observing, but only if the project gives them an artifact to observe it against.

The second: that the architectural rules that matter most to engineering organizations have always been the hardest to enforce, because they live above the syntax tree where conventional linters cannot see. A uniform, polyglot, structured sidecar format is the substrate those rules need. The same artifact that keeps an agent honest within a unit lets an organization keep itself honest across a portfolio.

The format is a trellis in the literal sense: a structure that does not grow the plant, but shapes how the plant grows. What grows on it is the codebase. What it shapes is the shape of the engineering organization that builds it.
