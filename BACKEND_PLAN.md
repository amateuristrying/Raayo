# Raayo: Backend Assessment and Delivery Plan

Assessment: 18 October 2026. This is a proposal, not an implemented backend.

## What exists

React Router pages render static JSON through reusable components. `src/engine`
contains browser stores built on `useSyncExternalStore`. Bookmarks, follows,
drafts, notifications, points and predictions persist in localStorage.
Market probabilities reset on reload and move through a random walk; a
prediction nudges a probability by one percentage point. This is not LMSR.
The landing scene is an independent iframe with vendored Three.js modules.

No server handlers, database, migrations, authentication provider, network API
client, WebSocket service, smart contracts or oracle integrations were found.
AI briefings, dates, participant counts and category statistics are fixtures.
The create-market form saves local submissions; it does not send a review request.

## Important limitations

- The graph is presentation data, not a normalized domain graph. Market event
  ownership is not required by `LiveMarket`; some relationships use synthetic IDs.
- A single untyped follow-ID list cannot reliably distinguish colliding entity,
  event and category identifiers. Backend follows need resource type plus ID.
- The wallet stores a mutable balance and only 30 recent transactions. It is not
  an immutable accounting ledger, and positions and debits are separate writes.
- Stored JSON is cast, not schema-validated. Data is user-editable and device-local.
- Drafts lack structured criteria, source URLs, resolution deadlines and rule
  versioning. Published fixtures have no enforceable lifecycle or settlement.
- Views assume immediate synchronous success. API integration must add pending,
  failed, stale and retry states; it is not just replacing a function body.
- Current mobile layouts and browser tests cover the main journeys, not a full
  production accessibility, performance or adversarial-security audit.
- The dependency audit reports five high-severity findings in the existing
  router/build dependency tree (react-router, react-router-dom, nanoid, postcss,
  source-map-js). They were not auto-upgraded as part of this frontend change;
  review applicability and patch them before production release.

## Recommended MVP boundary

Start with one deployable modular backend and a relational database. Keep
modules explicit without introducing independently deployed services yet.
Maintain virtual points and centralized resolution. There is no reason to add
wallet signatures, tokens or smart contracts merely to support predictions.

1. Identity and social: authenticated sessions, profiles, typed follows,
   bookmarks, notification preferences; enforce ownership on every mutation.
2. Catalog: categories, entities, events, event-entity links, markets and
   outcomes. Every market has a required event ID; categories are relationships,
   not a display label. Use stable IDs and queryable archives.
3. Market workflow: draft, pending review, live, locked, resolving, resolved,
   archived. Review captures immutable rule versions before activation.
4. Pricing: an isolated deterministic module, initially evaluating LMSR.
   Model outcome inventory, liquidity parameter, cost differences, buy/sell
   quotes, rounding and inventory changes. Server quotes expire and carry a
   market version; the browser never determines the accepted price.
5. Accounting: append-only double-entry points ledger with balanced postings,
   idempotency keys, exact arithmetic and reconciliation. Commit inventory,
   positions and wallet postings atomically under concurrency control.
6. Evidence and resolution: source registry, evidence snapshots with timestamps
   and hashes, proposed outcomes, independent reviewer approval, dispute window,
   final decision and exactly-once settlement. Handle postponement, cancellation,
   ambiguity and void/refund policy before markets go live.
7. Delivery: transactional outbox and workers for notifications, search indexing,
   probability history and cached summaries. Add resumable SSE/WebSockets once
   durable events exist; clients recover missed changes from the API.
8. Intelligence: citation-backed event/category/entity summaries from approved
   evidence. AI may explain and summarize; it must not silently decide outcomes.
9. Analytics: derive accuracy, calibration, category expertise and reputation
   from final outcomes; separate realized returns from marked-to-market estimates.

## Resolution and oracle decision

**Use a centralized evidence-backed resolution provider for the MVP.** Predefine
criteria, authoritative source, trading lock time and resolution deadline.
Use ECI, RBI, BCCI/ICC, exchange or official issuer sources as appropriate to
each question. Verify access/licensing and failure handling before ingestion.
An API response alone is not adjudication: corrections and contradictory
announcements require a recorded review decision.

Define a provider boundary around submitting a resolution request, retrieving
its status and evidence, disputing it and observing finality. Keep the internal
resolution ID and rule version stable regardless of provider. Settlement
consumes a finalized decision rather than arbitrary provider callbacks.

If on-chain settlement becomes an explicit product requirement later:

- UMA's optimistic oracle is a candidate for real-world event questions with
  proposals, bonds and a challenge/dispute process. This entails economic and
  operational assumptions, not instant truth. [UMA documentation](https://docs.uma.xyz/resources/optimistic-oracle).
- Chainlink Data Feeds are a candidate for supported structured numeric feeds,
  subject to feed availability, freshness and market-specific rules. They are
  not a universal election, cricket or movie adjudicator. [Chainlink documentation](https://docs.chain.link/data-feeds/overview).

Neither is selected or integrated here. Evaluate network support, costs,
finality, source coverage and independent security review at that future stage.
Any real-money release needs a separate jurisdiction-specific legal and
compliance assessment; product wording does not establish legal eligibility.

## Delivery sequence and acceptance gates

1. Graph and identity: seed the existing fixtures into normalized tables; a
   category leads to events/entities, then markets. Private data is user-scoped.
2. Read APIs: catalog details, cursor search, feed views, watchlist and bookmarks.
   Replace demo state behind explicit async loading/error boundaries.
3. Virtual prediction loop: quote, confirm, balance, position, history. Prove
   concurrent requests cannot overspend; retries cannot duplicate orders.
4. Moderator workflow: submit, review, publish, lock, gather evidence, propose,
   dispute, finalize, settle. Rules cannot change unnoticed after activation.
5. Intelligence and live delivery: evidence-backed summaries, alerts, search
   indexing and reconnectable updates, with latency/error monitoring.
6. Production hardening: authorization tests, rate limits, backups and restore
   drills, audit logging, secrets management, observability and incident paths.

Suggested contracts: catalog GETs; `POST /quotes`; idempotent `POST /predictions`;
`GET /portfolio`; typed follow/bookmark mutations; market-draft review endpoints;
evidence and resolution commands; cursor-based notifications/search.
Keep resolution and points authority exclusively on the server.
