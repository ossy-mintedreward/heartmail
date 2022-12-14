SBW 2010: Filter service API
=========================

Dependencies
------------

* SBW 2009: Script template labels

Introduction
------------

When sending a transaction p2p, it is important to send both the input
transactions and the Merkle proofs of those transactions in order for the
recipient to verify (offline) that the transaction is valid. The **transaction
ancestry** is a data structure that includes all input transactions, and
possibly inputs of inputs, all the way back to the most recently confirmed
transactions, along with the Merkle proofs for all of those (confirmed)
transactions.

When a wallet receives a transaction with the transaction ancestry, the wallet
must verify that all input transactions contain valid Merkle proofs with a
Merkle root of a block that the wallet knows exists in the longest chain. And
they must verify that the transaction itself is actually valid using the usual
transaction verification method.

All filter services must have a standardized API so that a user can substitute one for the other. In other words, they must have a commiditized API.

The API should be something like this:

<code>
GET: all transactions matching [template]
BODY: paginated transaction results

SUBSCRIBE: all transactions matching [template]
<code>