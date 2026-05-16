---
title: "Project Manifesto"
summary: "The purpose, scope, and editorial standards for trellis.longship.dev."
kicker: "Manifesto"
url: "/manifesto/"
---

# Project Manifesto

## Purpose

This repository exists to publish the public intellectual surface of **Trellis**.

It is not primarily a product marketing site, a changelog, or a developer portal. It is a small, durable publication site whose job is to explain what Trellis is, why it exists, what problem it addresses, how it thinks about software design under AI assistance, and how a serious reader should evaluate it.

The site should help a careful technical reader move from first contact to informed judgment.

That means the site must do three things well:

- make the core idea legible quickly
- make the strongest argument for the idea available in durable written form
- make skepticism easy rather than inconvenient

## Core Claim

The central claim behind Trellis is that **intent must become a first-class artifact in AI-assisted software development**.

Tests are not enough. Code is not enough. High-level project documentation is not enough. AI systems, and often humans too, make poor local decisions when the intent of a unit is implicit, scattered, stale, or absent. Trellis proposes a sidecar specification format and tooling layer that keeps intent near the code, reviewable in version control, and available to both humans and machines before implementation changes are made.

This site exists to communicate that claim with seriousness and precision.

## Audience

The audience is not everyone.

The primary readers are:

- developers evaluating whether Trellis is worth learning
- staff and principal engineers evaluating whether Trellis is technically coherent
- architects and engineering leaders evaluating whether Trellis could operate as an organizational substrate
- skeptical technical readers who want the strongest objections addressed honestly

This site should assume an intelligent technical reader. It should not talk down to the audience, oversimplify the thesis into slogans, or substitute enthusiasm for argument.

## What The Site Is

This site should behave like a **technical publication with a front door**.

The landing page should introduce Trellis clearly and give readers a small number of strong reading paths. After that first page, the site should open into a set of mostly static documents:

- the conceptual whitepaper
- the objections FAQ
- use cases
- practical papers
- a glossary
- success stories
- author pages
- links and references

The whitepaper and FAQ are not supporting content for the landing page. They are the intellectual center of the site. The landing page exists to orient readers toward them.

## What The Site Is Not

This site should not drift into being:

- a generic SaaS marketing page
- an animation-heavy product showcase
- a blog that demands a constant publishing cadence
- a documentation system optimized for API reference
- a place for weak, repetitive, or filler writing

If content does not deepen understanding, sharpen the case, answer a credible question, or document a real outcome, it probably does not belong here.

## Editorial Standard

The standard for writing on this site should be:

- clear
- rigorous
- skeptical of its own claims
- willing to state limits plainly
- more interested in precision than hype

Documents should read as if they expect scrutiny.

The preferred voice is deliberate and technical. Claims should be framed tightly. Objections should be stated in their strongest form. When the project depends on assumptions, those assumptions should be named. When the idea has limits, those limits should be admitted without defensive language.

The site should earn trust by showing its work.

## Design Standard

The design should support the writing rather than compete with it.

That means:

- the landing page may be visually shaped and intentional, but not theatrical
- interior pages should prioritize readability and calm
- typography should carry much of the aesthetic weight
- graphics should be sparse and meaningful
- code samples and structured text should be easy to scan

The site should feel like a serious technical essay collection, not a startup pitch deck.

## Structural Standard

The content architecture should stay legible as the corpus grows.

Each section should have a distinct job:

- **Whitepaper:** the main affirmative case
- **FAQ:** the strongest adversarial case and its responses
- **Use Cases:** concrete situations where Trellis changes engineering outcomes
- **Papers:** longer essays and adjacent conceptual work
- **Glossary:** stable definitions and vocabulary discipline
- **Stories:** credible reports of use, adoption, or observed impact
- **Authors:** authorship, provenance, and institutional context
- **Links:** repository, talks, demos, references, and related work

New content should be added because it belongs to one of these jobs, not because there is room on the site for more pages.

## Technical Standard

The implementation should remain lightweight and durable.

This project is appropriately built as a static site. The technology should remain subordinate to the content:

- static-first over application-like complexity
- Markdown-first for authored documents
- minimal client-side behavior
- fast builds and low operational burden
- styling that is consistent and restrained

The site should be easy to maintain, easy to publish, and hard to accidentally bloat.

## Measure Of Success

This site is successful if a serious reader can arrive skeptical and leave with one of two outcomes:

1. they understand Trellis clearly and think it is worth deeper evaluation
2. they understand Trellis clearly and can explain exactly why they reject it

Confusion is failure. Vagueness is failure. Empty enthusiasm is failure.

The standard is not universal persuasion. The standard is clarity, intellectual honesty, and durable explanation.

## Working Rule

Every addition to this repository should answer one question:

**Does this make Trellis easier to understand, easier to evaluate, or easier to trust?**

If the answer is no, it should probably not be added.
