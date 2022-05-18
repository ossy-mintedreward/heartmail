HeartMail Protocol Specifications
=================================

All protocol draft and final specifications are in this directory in the form of
a markdown file.

Ordering
--------

All specs are numbered starting with 1. If ESW X depends on ESW Y, then X > Y.
e.g., ESW 10 can use ESW 1 - ESW 9 as a dependency.

Protocol specifications that depend on each other should either be merged into
one spec or broken up into a hierarchy to follow the above rule.

In other words, the specs form a directed acyclic graph.

Standard information
--------------------

Specs should always include:
- Number
- Name
- Status (Draft or Deployed)
- Authors
- Dependencies
- Full text of the specification
- Tests
- Implementation

Protocol lifecycle
------------------

A protocol always has a status of either:

- **Draft**: Work-in-progress.
- **Final**: Deployed across two consortium members.

A protocol specification is always draft to begin with and becomes final later.

A specification is not final until the OpenSPV implementation of the
specification is finished and deployed publicly on the web by at least two
consortium members.

Once a protocol specification is final, it cannot be changed except in trivial
ways.

Early Protocols
---------------

### Stamps Milestone

1 Craig = 10^8 stamps

* Script
* Input / Output
* Transactions
* SV = Stamps Verification
* SPV = Simplified Postage Verification

### Mailbox Milestone

* Key Alias
* Email Web Extension
* Email identity keys
* Email verify public key owner
* Email signatures (without revocation)
* Email authentication (without revocation)
* Two Factor Friend (2FF)
* Two Factor Friend (2FF) service
* Email key logging and revocation data structures
* Script template labels
* Filter service API
* Filter service Email2 extension
* Filter for Email2 key logging and revocation
* Email signatures (with revocation)
* Email authentication (with revocation)
* Email invoices and P2P payments
* Merkle proof data structure
* Transaction ancestry data structure
* Merkle proof service
* SPV payments
* Paid Merkle proof service

### Media milestone

* Media types: Video, images, text, software, ...
* Media authorship attestation
* Media basic rights (sell, resell)
* Email media transfer

### DHT milestone

...

### Legal contract milestone

...

### Other Misc Protocols

* Email to phone (phone+14155150210@phone-host.com)
* Domain key, e.g. heartmail.com signs the transfer of an account