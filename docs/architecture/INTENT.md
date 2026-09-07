# Bounded intent architecture

The Studio sends the question, conservative column profile, declared semantic context, and optional prior revision plan to `/api/intent`; it never sends source rows. Cloudflare Workers AI returns narrow intent slots, not results or executable code. Deterministic browser code compiles those slots into an `AnalysisPlan`, rejects unknown fields and semantic conflicts, detects material grain ambiguity, and only then permits the existing engine to compute.

The model/provider/prompt version and original slot proposal remain in revision provenance. Model-generated totals are neither requested nor accepted. Provider failure, malformed output, unsupported intent, or exhausted staging inference budget fails closed without creating a revision or execution trace. The deterministic keyword adapter remains only as a test fixture.

The staging API has a global 100-request hourly D1 budget. This limits accidental or abusive spend but is not fair per-user rate limiting and can be exhausted by one caller. Authentication, private datasets, and production abuse controls remain outside the founding proof.
