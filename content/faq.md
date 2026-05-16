---
title: "Trellis Objections FAQ"
summary: "An honest steelman of the strongest objections to Trellis, with the strongest available responses."
kicker: "FAQ"
url: "/faq/"
---

### An Honest Steelman of Why Trellis Might Not Work — and the Strongest Available Responses

---

## Preface

This document is the companion to the Trellis white paper. Where the white paper makes the affirmative case, this one makes the adversarial case — and then answers it. The objections are presented in their strongest form, not as caricatures. The responses are the strongest available replies, not deflections. Where an objection is partially valid, the response says so. Where a response is incomplete, the document says so.

The intent is to give a careful reader — whether an individual developer evaluating Trellis for their workflow, a staff engineer evaluating it for a team, or an architect evaluating it for an organization — an honest accounting of what they would be signing up for. A tool that can survive its own steelman is more credible than one that cannot.

Each objection ends with a brief assessment of how much of the original concern survives the response.

---

## 1\. "This is a discipline problem in tool clothing"

### The objection

Every failure mode Trellis is designed to address — duplication, needless rewrites, drift, eroded Single Responsibility — is fundamentally a discipline failure rather than a tooling failure. Organizations with discipline problems do not solve them by adopting tools that require *more* discipline to use correctly than the original work did. They solve them by hiring better senior engineers, doing real code review, or accepting the cost.

The history of software is littered with formats and frameworks that promised to encode discipline at the artifact level: UML, Rational Rose, formal methods, Eiffel, design-by-contract, the entire CASE tool industry of the 1990s. The pattern is consistent. They work in disciplined organizations that did not need them, and fail in undisciplined organizations that did.

Trellis appears to be a continuation of this lineage. It asks developers to write a structured artifact, keep it in sync with the code, review it in PRs, and treat it as a first-class deliverable. The teams that will actually do this are the teams that already write good documentation, do good code review, and enforce architectural rules through other means. For them, Trellis is overhead. The teams that desperately need it will write garbage `.trellis` files, fail to update them, and end up worse off than before — because they will have a *lying* artifact that the agent treats as authoritative.

### The response

The objection assumes a 2018 cost model where humans bear the entire burden of writing and maintaining the sidecar. That cost model is the reason every prior tool in the lineage failed, and it is no longer the cost model that applies.

Trellis is designed to be adopted the way TypeScript was — gradually, file by file, with value at every increment. A single `.trellis` file next to a single Ruby service delivers immediate, local value: the agent has better context for that one file. No organizational buy-in is required. No mandate is needed. The first sidecar pays for itself before the second one exists.

More importantly, the writing and maintenance of sidecars is not a job humans have to do alone. The same agents that benefit from reading sidecars are capable of generating them from existing code, drafting updates as part of the same pull request that changes the code, and flagging drift in review. The work shifts from "write this artifact from scratch" to "review this generated artifact." This is a meaningfully different proposition than what UML or Rational Rose ever asked for. Those tools assumed the artifact had to be human-authored end-to-end; Trellis assumes a human-AI partnership over the artifact, with the human responsible for review and judgment rather than transcription.

### Honest residual

The TypeScript analogy has a limit worth acknowledging. TypeScript had ground truth — the JavaScript runtime — that types could be checked against. When a TypeScript annotation is wrong, the compiler eventually catches it. Trellis sidecars contain claims that have no equivalent automated check: intent, layer assignment, whether something is genuinely "out of scope." When such an annotation is wrong, nothing catches it except a human noticing.

So the gradual-adoption story holds. The guarantee story does not. Trellis can be adopted incrementally and provide incremental value, but it cannot promise that the artifact will not lie. The discipline-problem critique is reduced from fatal to ongoing — the price of admission for any tool that captures intent rather than syntax.

---

## 2\. "Sidecars rot, and these will rot worse than most"

### The objection

Documentation drift is the oldest problem in software, and Trellis has not solved it. The `@reviewed:` timestamp and CI warning are exactly the same mechanism as the `@updated` tags on docstrings that everyone ignores, the "last reviewed" stamps on Confluence pages that everyone ignores, and the architectural decision records that get written for the launch and never touched again.

The CI warning becomes noise within a quarter. People add `@reviewed:` to PRs as a checkbox without reading the file. Within a year, the sidecars are systematically wrong, and the agent — which trusts them — is making decisions based on a fictional version of the codebase. This is *worse* than having no sidecars, because at least without sidecars the agent reads the code, which is by definition current. The sidecar inserts a layer of plausible-looking, structured, machine-readable lies between the agent and the truth.

### The response

Rot detection is not an afterthought in Trellis; it is a feature. The CI mechanisms that catch drift are surfacing high-signal organizational information. A repository where sidecars are systematically allowed to rot is a repository telling its leadership something important about itself — that the discipline of keeping intent and code aligned has broken down. That signal is more valuable than its absence would be.

The objection assumes the warning will be ignored. That is true in organizations that ignore signals generally. Those organizations are not the audience for Trellis. The organizations that adopt Trellis are the ones that already treat CI signals seriously, that staff their PR review with actual reviewers, and that have made an organizational commitment to keeping intent capture honest. For them, "rot is detectable" is a feature precisely because they will act on the detection.

### Honest residual

The response is correct for the *kinds* of rot the system can actually detect. It is silent on the kinds it cannot. There are four:

- **Behavioral rot** — the code does X but the spec says Y. Partially detectable through tests. Real signal.  
- **Structural rot** — the `Consumes:` list references a dependency the code no longer uses. Mechanically detectable by parsing imports. Real signal.  
- **Metadata rot** — `@layer:`, `@context:`, `@stability:` are stale. Not automatically detectable. No ground truth.  
- **Intent rot** — the `Feature:` summary describes what the unit *was supposed to do*, not what it does now. Not automatically detectable. The very thing that makes the summary valuable to the agent — its abstraction over implementation — is what makes drift in it invisible.

Trellis can claim "rot is signal" honestly for the first two categories. It cannot claim it for the second two, which are also the categories most valuable to the architectural-substrate story. This is a real limit, and the white paper should acknowledge it rather than imply blanket coverage. The realistic claim is: Trellis detects more rot, and earlier, than tools that operate on code alone — but it does not detect all rot, and the undetectable kinds compound silently.

---

## 3\. "The polyglot architectural-substrate story is the weakest part, not the strongest"

### The objection

The §6 claim that Trellis becomes a substrate for cross-language architectural enforcement depends entirely on developers correctly and honestly tagging their files with `@layer:`, `@context:`, `@stability:`, and accurate `Consumes:` lists. The enforcement is only as good as the tagging. The tagging is done by the same developers whose architectural discipline is being enforced.

This is circular. Worse, it is structurally weaker than the alternatives it competes with. ArchUnit (for JVM languages), dependency-cruiser (for JavaScript), and similar tools reason about *actual* import statements and call graphs — ground truth from the AST, not self-reported metadata. They are harder to fool because they read what the code does, not what the developer says it does. Even a senior engineer at a perfectly disciplined organization can misjudge whether a new file belongs in `@layer: domain` or `@layer: application`. They make their best call in good faith, are sometimes wrong, and the linter passes on the wrong tag because the linter has no way to know.

Trellis's polyglot story sounds attractive precisely because it sidesteps the hard work of building real cross-language analysis. The sidestep is the weakness.

### The response

The architectural-substrate story is a secondary benefit, not the primary thesis. The primary thesis is unit-level intent capture for AI-assisted development. The architectural value is real but acknowledged-as-self-reported, with all the caveats that implies.

Trellis is not positioned as a replacement for ArchUnit or dependency-cruiser, and where those tools are available, they remain the right choice for hard-edged architectural rules with clear ground truth. What Trellis offers is complementary: an *intent-aware* architectural view that derived tools structurally cannot provide. ArchUnit can tell you that `BillingService` imports `UserRepository`. It cannot tell you that the import was deliberate, or that the boundary was reviewed and approved, or that the unit owner intends this dependency to be permanent versus tactical. Self-reported metadata is weaker as ground truth and stronger as captured intent.

The right framing is: derived tools (ArchUnit, dependency-cruiser) and declarative tools (Trellis) coexist. Derived tools answer "what is the code actually doing?" Declarative tools answer "what was the code supposed to do, and does the actual behavior match?" The disagreement between them — derived dependency that no sidecar declares, declared dependency that no derived tool sees — is itself a high-value signal that neither tool produces alone.

### Honest residual

Even with this reframing, the architectural-substrate claim in §6 is the part of Trellis that requires the most caution in marketing. It is genuinely useful, but it is not a substitute for derived analysis where derived analysis is available. Organizations should adopt Trellis for its intent-capture properties first, and accept the architectural-enforcement properties as a complementary benefit — not as a replacement for tools that already exist for the same purpose.

For polyglot organizations specifically, the honest pitch is: "Trellis gives you a single declarative substrate for expressing intent across languages. It does not give you derived dependency analysis across languages. If you have the latter, keep it. If you don't, Trellis offers something — but something with self-reported limits."

---

## 4\. "You are betting against the trajectory of the agents"

### The objection

Trellis is designed for agents that have limited context, cannot economically read large portions of a codebase, and benefit from a curated, abstracted summary attached to each file. That is a real description of agents in 2024 and 2025\. It is a less-real description of agents in 2026, and it will be a fictional description of agents in 2028\.

Context windows are growing fast. Code-aware retrieval is improving fast. Agents that load and reason about the relevant 50,000 lines of a codebase before making a change are already deployable, and the cost is dropping. The duplication and rewrite problems Trellis points at are largely artifacts of agents that *cannot afford* to look. Once they can afford to look, the sidecar becomes a redundant abstraction layer that the agent has to reconcile against the source it is also reading. In the worst case, the sidecar contradicts the source and the agent has to decide which to trust — which is exactly the failure mode being created, not solved.

Trellis is scaffolding for a problem that is being solved at the model layer. By the time the format is mature enough for adoption at scale — at minimum a two-year project — the specific failure mode it addresses may be substantially reduced.

### The response

The empirical evidence on context window utilization runs in the opposite direction. The "lost in the middle" problem, the documented degradation of attention quality past a certain context length, and the consistent finding that *focused* context outperforms *abundant* context — these results have held across model generations. If anything, the trend is that better models exploit good context structure *more*, not less. A model that can reason about 200,000 tokens still does better when given the right 5,000 than when given all 200,000.

This means Trellis's value proposition is largely agent-trajectory-resistant. Even if agents can read the entire codebase, they get better results from reading the curated sidecar first and using it to navigate. The sidecar is not competing with the agent's ability to read code; it is competing with the agent's ability to *figure out where to look*. That problem does not go away with larger contexts — it gets worse, because the search space is larger.

There is a further argument, structural rather than empirical. A summary the agent generates fresh each session is not the same artifact as a summary that lives in the repository, was reviewed in a pull request, and represents organizational consensus. The agent's transient working memory cannot replace a version-controlled, human-reviewable, organizationally-shared artifact. As agents improve at *generating* curated context, some of Trellis's value is absorbed into the agent layer. But the *durability* property — that the curated context persists across sessions, agents, and developers — is something the agent layer cannot provide on its own.

### Honest residual

The piece of the original objection that survives: as agents get better at generating, summarizing, and navigating large codebases on the fly, *some* of Trellis's value gets absorbed into the agent layer. The portion of Trellis's pitch that emphasizes "agents can't read the whole codebase" does weaken over time. The portion that emphasizes "agents need durable, version-controlled, organizationally-shared intent" does not. The white paper should lean on the second framing, not the first.

---

## 5\. "The format will be hated, and the hate is justified"

### The objection

Trellis imposes a specific philosophical view of software: that intent is separable from implementation, that contracts are stable enough to write down, that boundaries are knowable in advance. This view is contested among good engineers, not just bad ones.

Significant subcommunities of strong developers hold the opposite position: that the code *is* the spec, that premature abstraction is a worse failure than duplication, that boundaries should emerge from refactoring rather than be declared upfront, that "ideal state" documents become straitjackets that prevent the system from evolving. This is the position of Rich Hickey, much of the Lisp tradition, much of the dynamic-language community, and a substantial portion of the "worse is better" lineage. They will look at Trellis and see a return to the waterfall-era promise that if we just specify hard enough up front, we can avoid the messy work of changing our minds.

These engineers are persuasive, and they include some of the people most skeptical of AI coding generally — exactly the audience whose buy-in the architectural-substrate story would need.

### The response

This objection is accepted, not refuted. Trellis is not for everyone, and the audience it is not for includes some of the best engineers working today. That is a real limit and worth being honest about.

The audience Trellis *is* for is the audience that already accepts intent-capture as worthwhile — the same audience that writes tests, writes documentation, uses type annotations, and finds value in design discussions before code is written. For that audience, Trellis is a continuation of practices they already endorse, not a violation of their philosophy. The LSP and agent-assisted generation reduce the typing cost. The reviewable, version-controlled artifact appeals to people who already think reviewable, version-controlled artifacts are how engineering should work.

Languages and methodologies are subjective. People who love Ruby and hate Java are who they are. People who believe code is the only honest specification will not adopt Trellis, and Trellis should not contort itself trying to convert them. This is a tool for people who care about the kinds of things Trellis cares about. Not everyone will, and that is fine.

### Honest residual

The response addresses the typing cost but not the *thinking* cost. The hardest part of writing a good `.trellis` file is not the keystrokes; it is deciding what the unit's invariants actually are, what is genuinely out of scope, what the right layer assignment is. An LSP does not help with that. An agent-generated draft can produce plausible-but-wrong answers that a tired developer will accept without scrutiny.

This is a real cost, but it is not a cost unique to Trellis. The same critique applies to writing tests, writing documentation, writing type signatures, and writing anything that captures intent. Trellis pays the same intellectual price as those practices, and accrues benefits in the same way. People who reject the price for those practices will reject it for Trellis. People who accept it for those practices have already accepted the relevant tradeoff.

---

## 6\. "The two-audiences framing hides a positioning problem"

### The objection

Trellis claims to serve two audiences with one artifact: the individual developer who wants AI-coding hygiene, and the organizational architect who wants cross-language enforcement. But the actual purchase decision looks different for each.

The individual developer asks "what do I get this week?" and the answer is "you write more files for the same code." The organizational architect asks "what do I get this quarter?" and the answer is "you need every team in the company to adopt this format and tag it correctly before any of the architectural enforcement works." Neither audience has a near-term win that justifies the cost.

Tools that have actually succeeded at organizational architectural enforcement — Sonar, ArchUnit-style tools — succeeded because they could be deployed by *one* team, against *existing* code, without requiring buy-in from anyone else. Trellis requires every team to write new artifacts and maintain them, and the value only materializes once enough teams have done so. This is a coordination problem of a kind that has killed many better-designed tools.

### The response

The objection uses a 2018 cost model. In an agentic-coding world, the marginal cost of producing and maintaining an artifact-per-file is dramatically lower than it was when testing was being adopted in the 2000s. A `.trellis` file is a trivial amount of content, can be generated or assisted by an agent, and accrues value to the whole organization once it exists. The cost barrier that killed prior coordination-dependent tools does not apply in the same form.

This is structurally similar to the argument that was made — and lost — against testing. "I know it works, why do I need to write tests?" was a familiar objection in the early 2000s. It was wrong then for the same reason it is wrong now: tests are a kindness whose value accrues to the organization, the individual developer, and the team across time. The organizations that rejected testing did not avoid the cost; they paid it as production bugs, debugging time, and architectural rot. The organizations that adopted testing benefited at every level. Trellis sits in the same position. Organizations that reject it do not avoid the cost of churn, drift, and duplication; they pay it as wasted agent-hours, conflicting implementations, and codebases that become harder to maintain.

The cost-model shift is the substantive point. The testing analogy is the rhetorical frame. Both are real.

### Honest residual

Testing won partly because tests have an immediate, individual-developer payoff: you catch your own bugs before shipping. That payoff existed at unit one, before any organizational adoption. Trellis's individual-developer payoff is weaker — you give the agent better context for your file, but you would have shipped fine without it. The collective benefit is real; the individual benefit is real but smaller.

This means Trellis's adoption mechanism may need to look different from testing's. Testing spread virally because individuals saw value before organizations did. Trellis may spread more through organizational adoption that creates the conditions for individual value, or through adoption-as-a-mandate from architects who see the systemic benefit. That is a real difference from testing's adoption story and worth being honest about. The end state can still be the same; the path to it is not identical.

---

## Summary

Six objections, six responses. Three of the responses are strong (the gradual-adoption story, the focused-context-beats-abundant-context evidence, and the cost-model-has-changed argument). Two are adequate but require honest acknowledgment of residual limits (rot detection works for some kinds of rot but not all; the format is not for everyone). One is weaker than the others and requires reframing rather than rebuttal (the polyglot story is real but secondary, complementary to derived tools rather than replacing them).

The pattern in the strongest responses is that they reframe the problem in terms of how the world has changed — cost models, agent capabilities, gradual adoption gradients — rather than denying the problem exists. The weaker responses are the ones that appeal to user discipline in places where the original objection was structural.

A reader who works through this document should come away with the same impression a careful steelman is meant to produce: that the idea has been stress-tested by someone willing to argue against it, that the real limits have been named rather than hidden, and that the surviving case is therefore more credible than an unchallenged case would be.

Trellis is a good idea. It is not an unconditionally good idea. The conditions under which it is good are stated above, in plain language, alongside the conditions under which it is not.  
