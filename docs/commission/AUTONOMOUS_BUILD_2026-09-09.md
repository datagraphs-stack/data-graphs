# DATA GRAPHS — AUTONOMOUS AGENT BUILD DIRECTIVE

This directive governs how automated agents should build DataGraphs.ai after the founding reset.

The objective is not to create a repository that merely contains plans, governance documents and architectural diagrams.

The objective is to create a system that **keeps building itself toward the roadmap** with minimal Owner intervention.

The Owner expects automated agents to operate like a competent technical team.

---

# 1. AUTONOMY IS THE DEFAULT

Agents are expected to:

- inspect the repository;
- understand the current project state;
- select dependency-satisfied roadmap work;
- implement it;
- test it;
- debug failures;
- review their own work;
- request or perform independent review where the repository requires it;
- merge reviewed work when authorized by the existing operating policy;
- validate staging;
- update durable project state;
- select the next legitimate task;
- continue.

Do not stop after each small task waiting for another Owner prompt.

The default loop is:

`STATE → SELECT → BUILD → TEST → REVIEW → INTEGRATE → VERIFY → RECORD → CONTINUE`

---

# 2. DO NOT CONFUSE AUTONOMY WITH UNSUPERVISED RANDOM CODING

Autonomous work must follow the canonical vision and dependency roadmap.

An agent may not simply select whatever task is easy or interesting.

Every substantial task should answer:

> What current project constraint does this remove, and how does it reduce distance to a commercially useful DataGraph?

Work that does not reduce that distance should normally be deferred.

Examples of valid progress:

- first real crawler;
- safer source discovery;
- source archive;
- meaningful change classification;
- structured observation extraction;
- entity identity;
- relationship creation;
- temporal graph history;
- signal detection;
- real Market Graph coverage;
- public graph-product usability.

Examples of likely drift:

- redesigning the Studio again;
- adding generic dashboards;
- building elaborate governance layers around nonexistent functionality;
- adding abstractions before a real source needs them;
- rewriting working infrastructure for elegance;
- creating extensive agent orchestration before agents have useful product work to execute.

---

# 3. BUILD PRODUCT MACHINERY, NOT CHECKLIST THEATER

Agents must distinguish between:

## PRODUCT PROGRESS

The system can do something new and useful.

Example:

> DataGraphs can now crawl an official company domain, archive its source pages and reconstruct the crawl later.

versus:

## PROCESS PROGRESS

A file, checklist, policy or test harness was added.

Process infrastructure is valuable only when it supports actual product execution.

Do not repeatedly mark a roadmap milestone complete because documentation exists while the corresponding runtime capability does not.

---

# 4. THE AGENT TEAM MODEL

Automated agents should behave as specialized members of one engineering organization.

Where multiple agents or parallel worktrees are available, divide work by responsibility.

Possible roles include:

## Technical Lead / Controller

Responsibilities:

- read canonical project state;
- maintain roadmap sequencing;
- select the next dependency-satisfied mission;
- prevent drift;
- reconcile conflicting work;
- decide when a milestone is actually proven.

## Acquisition Agent

Owns:

- source registry;
- crawl policy;
- crawling;
- retrieval;
- redirects;
- robots/source policy;
- rate limiting;
- crawl scheduling;
- source diagnostics.

## Evidence Agent

Owns:

- immutable snapshots;
- hashing;
- R2 archives;
- fingerprints;
- snapshot metadata;
- change classification;
- provenance.

## Extraction Agent

Owns:

- structured observation extraction;
- deterministic parsers;
- structured metadata;
- AI-assisted candidates;
- validation;
- extraction evaluation.

## Identity Agent

Owns:

- canonical entities;
- aliases;
- identifiers;
- resolution candidates;
- false-merge protection;
- merge/split history;
- conflict handling.

## Graph Agent

Owns:

- graph entities;
- relationships;
- temporal properties;
- graph projections;
- query interfaces.

## Signals Agent

Owns:

- graph differences;
- event detection;
- historical changes;
- significant-change classification;
- intelligence signals.

## Product Agent

Owns:

- Market Graph;
- exploration;
- search;
- timelines;
- evidence display;
- graph product UX;
- public intelligence surfaces.

## Review Agent

Owns independent checks of higher-risk changes.

Review should focus on:

- correctness;
- provenance;
- irreversible mistakes;
- false identity merges;
- data mutation safety;
- deployment safety;
- roadmap alignment.

Do not create these roles merely as bureaucracy.

Use specialization only when it increases throughput.

---

# 5. PARALLELISM IS ENCOURAGED WHERE DEPENDENCIES ALLOW IT

Agents should not serialize work unnecessarily.

Examples:

While the Source Registry is being finalized:

- another agent may design representative source fixtures;
- another may build archive storage primitives;
- another may develop crawler tests.

While crawling machinery is being proven:

- the graph agent may design schemas against known sample observations;
- the product agent may build read-only inspection surfaces.

But parallel tasks must not independently invent incompatible architecture.

Shared contracts must have one canonical owner.

---

# 6. EVERY AGENT MUST READ DURABLE CONTEXT FIRST

Before significant implementation, agents should inspect the relevant canonical files.

At minimum:

- `AGENTS.md`
- `docs/FOUNDING_RECORD.md`
- `docs/PRODUCT_VISION.md`
- `docs/ROADMAP.md`
- `docs/PROJECT_STATE.md`
- relevant ADRs;
- relevant architecture documents;
- current Git state.

Do not rely on conversation memory.

Do not rely on an earlier agent's interpretation if repository truth has changed.

---

# 7. PROJECT STATE MUST FUNCTION AS THE TEAM'S SHARED MEMORY

`docs/PROJECT_STATE.md` should remain a concise live cursor.

It should answer:

- what is currently built;
- what is actually deployed;
- what is proven;
- what is not proven;
- current repository/branch state;
- current milestone;
- current blocker;
- exact next dependency;
- what agents may continue independently.

Do not turn it into an endless historical diary.

Historical reasoning belongs in:

- ADRs;
- receipts;
- architecture docs;
- Git history.

---

# 8. AGENTS SHOULD CONTINUE UNTIL THEY HIT A REAL BLOCKER

A failed test is not an Owner blocker.

A TypeScript error is not an Owner blocker.

A broken deployment command is not an Owner blocker.

A schema mismatch is not an Owner blocker.

An implementation mistake is not an Owner blocker.

Agents should diagnose and fix ordinary engineering failures themselves.

Escalation should be exceptional.

Legitimate escalation generally means:

- secret or credential unavailable to the agent;
- paid-provider commitment;
- destructive production action;
- irreversible data deletion;
- legal/compliance decision requiring Owner judgment;
- material business strategy ambiguity not answered by founding documents;
- production/customer-data action outside existing authorization.

If the answer can be derived from the canonical vision, roadmap, existing architecture or code, derive it and continue.

---

# 9. DO NOT CREATE FAKE OWNER GATES

The Owner has already authorized normal constructive project work.

Do not repeatedly stop with messages such as:

> Awaiting Owner permission to continue Phase 3.

That is not useful.

If the action is ordinary, reversible, non-production engineering and aligned with the roadmap, continue.

Only surface Owner intervention when an actual human-only input exists.

If the Owner's likely answer to a routine question is obviously:

> Yes, continue building the project,

then do not ask the question.

---

# 10. REMOTE ACTIONS REQUIRE RISK-BASED JUDGMENT

Not every remote operation is equal.

## Normally acceptable under autonomous staging work

Subject to repository policy:

- staging deployment;
- read-only staging verification;
- creating bounded non-production test data;
- applying reviewed staging migrations;
- staging crawl execution;
- staging R2/D1 use;
- Cloudflare Workers Builds;
- bounded browser testing.

## Escalate or obey explicit higher-tier gates for

- production deployment;
- DNS cutover;
- real customer data mutation;
- paid services;
- destructive migrations;
- deleting evidence;
- altering secrets;
- irreversible identity merges;
- broad uncontrolled crawls;
- legally sensitive acquisition methods.

Use proportional controls.

Do not apply production-grade ceremony to every local unit test.

---

# 11. FAIL CLOSED ON DATA TRUTH, NOT ON PROJECT MOMENTUM

DataGraphs should be conservative about truth.

Examples:

- ambiguous entity resolution → unresolved;
- uncertain extraction → candidate/review;
- malformed source → unclassified;
- missing evidence → do not publish claim;
- conflicting facts → retain conflict.

But project execution should remain aggressive.

The correct operating combination is:

> **Conservative data authority + aggressive engineering progress.**

Do not confuse one with the other.

---

# 12. AUTOMATED AGENTS SHOULD USE REAL DATA EARLY

Synthetic fixtures are valuable for testing.

They are not product proof.

Each major system should transition to bounded real sources as early as safely possible.

For example:

### Crawler

Synthetic:

- redirect fixture;
- malformed HTML fixture;
- rate-limit fixture.

Then real proof:

- 5 real company domains.

### Extraction

Synthetic:

- controlled product page.

Then real proof:

- multiple differently structured real company pages.

### Entity resolution

Synthetic:

- obvious aliases.

Then real proof:

- company names, domains and products from the proving market.

### Signals

Synthetic:

- changed fixture.

Then real proof:

- detected real-world change between two source observations.

Agents should actively seek these transitions.

---

# 13. AUTOMATED CRAWLING SHOULD BE BUILT AS AN OPERATING SYSTEM

The eventual foundry should not require a developer to manually run one script per company.

Agents should progressively build machinery that can operate from a mission definition.

Conceptually:

`Graph Mission`
→ define ontology
→ register seed sources
→ discover pages
→ schedule acquisition
→ archive snapshots
→ extract observations
→ resolve entities
→ compile graph
→ identify gaps
→ discover more sources
→ monitor refresh
→ create events
→ publish graph

The agents building DataGraphs should themselves use this machinery wherever possible.

The system should become increasingly self-operating.

---

# 14. AGENTS SHOULD CREATE FEEDBACK LOOPS

Every autonomous system needs measurable outputs.

Examples:

## Crawl health

- registered domains;
- reachable domains;
- pages discovered;
- pages successfully fetched;
- failures;
- median fetch latency;
- content-type distribution.

## Extraction health

- eligible pages;
- observations extracted;
- structured-parser success;
- AI candidate success;
- rejected candidates;
- unsupported pages.

## Identity health

- entities;
- exact resolutions;
- candidate resolutions;
- unresolved;
- conflicts;
- merge reversals.

## Graph health

- entities;
- relationships;
- provenance coverage;
- stale entities;
- temporal coverage.

## Signal health

- changed pages;
- meaningful changes;
- events produced;
- false-positive rate where reviewed.

## Product health

- usable company profiles;
- complete timelines;
- public searches;
- graph coverage;
- user interactions.

Agents should use these measurements to select future work.

---

# 15. THE AGENTS MUST NOT OPTIMIZE FOR COMMIT COUNT

Many commits can mean high throughput.

They can also mean sophisticated wheel-spinning.

The operating metric is not:

> commits per day.

It is:

> how much closer is the system to producing a valuable graph-powered intelligence product?

A single task that enables 100-company autonomous acquisition may be more important than 30 UI improvements.

---

# 16. LONG-RUN EXECUTION

When an agent is assigned a long coding session, it should not stop after the first roadmap checkbox.

It should:

1. reconcile current state;
2. identify the next dependency chain;
3. estimate the work;
4. execute the first task;
5. validate;
6. record;
7. continue to the next unblocked task;
8. stop only at:
   - a genuine blocker;
   - the defined session boundary;
   - an unsafe action requiring escalation.

Every milestone and task in the roadmap should include a rough autonomous implementation effort estimate so longer agent sessions can be assigned intelligently.

---

# 17. BLOCKER PROTOCOL

When blocked, agents must record the blocker in a way another agent can understand immediately.

Include:

- project/milestone;
- exact blocker;
- evidence;
- last attempted action;
- why retrying unchanged conditions is pointless;
- what new information would unblock it;
- whether the Owner is actually required;
- what independent work can continue.

Never allow automated schedules to rerun the same failed action hourly without changed evidence.

That is token burn, not autonomy.

---

# 18. PORTFOLIO HQ REPORTING

DataGraphs agents should eventually report significant milestones and blockers to the portfolio control plane when that integration is available.

Useful events include:

- crawl milestone complete;
- new proving-market coverage;
- deployment;
- blocker;
- owner-required secret;
- failed source cohort;
- graph quality regression;
- major roadmap milestone;
- first customer/business proof.

The goal is for the Owner to see:

> what changed, why it matters and what needs attention.

Not merely:

> workflow ran successfully.

---

# 19. THE FIRST AUTONOMOUS BUILD CAMPAIGN

After founding-reset documentation is reconciled, begin a sustained autonomous build campaign toward:

# THE FIRST 100-COMPANY MARKET GRAPH

Recommended dependency order:

1. Source Registry
2. crawl mission schema
3. bounded crawler
4. raw snapshot archive
5. source fingerprint/change detection
6. page classification
7. structured observations
8. canonical company identity
9. canonical product identity
10. relationships
11. repeated refresh
12. temporal events
13. coverage diagnostics
14. 100-company graph
15. public Market Graph
16. monitoring/signals

Continue ordinary engineering through these stages unless a real blocker exists.

Do not spend the campaign rebuilding the CSV Studio.

---

# 20. FINAL OPERATING PRINCIPLE

The Owner should increasingly be able to leave the project alone for days and return to find:

- more sources acquired;
- more graph coverage;
- better entity resolution;
- more historical observations;
- better signals;
- improved intelligence products;
- clear records of what changed;
- only genuine Owner decisions waiting.

That is the standard.

Automated agents are not being used merely to save typing.

They are being used to create a **self-advancing engineering and data-production organization**.

The target is:

> **DataGraphs builds the machinery that builds and maintains DataGraphs.**
