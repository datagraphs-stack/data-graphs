# Founding persistence architecture

The browser creates and validates the complete DataGraph envelope before storage. `POST /api/datagraphs` validates and creates an immutable-history record; `GET /api/datagraphs/:id` returns it to link holders; authorized `PUT` may only append revisions while source, semantics, and prior revisions remain byte-for-byte equivalent under canonical JSON; authorized `DELETE` removes it.

D1 table `datagraphs` stores the entity ID, JSON envelope, write-token hash, and timestamps. The canonical two-revision envelope measured 11,752 bytes, so adding R2 would not yet solve an observed need. The source remains exact base64 bytes inside the envelope. The 1 MB API limit is a proof boundary, not an advertised product limit.

`/g/<dataGraphId>` rewrites to the Studio shell. The Studio retrieves and validates the envelope, reconstructs the view from the stored result and trace, labels it historical, and never recomputes during load. A write token remains in the creator's local storage and is never returned by the public read endpoint or placed in the URL. A separate browser receives a read-only view.

This is an explicitly public-link staging proof without authentication. Do not describe it as private sharing. Authentication, access revocation independent of deletion, rate limiting, production retention, and larger-source custody remain required before accepting sensitive external-user data.
