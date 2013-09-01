Replicator Database
===================

Introduction
------------

The `/_replicator` database is a special database where you PUT/POST
documents to trigger replications and you DELETE to cancel ongoing
replications. These documents have exactly the same content as the JSON
documents you can POST to `/_replicate/`. See
replication-using-the-old-api. Fields are `source`, `target`,
`create_target`, `continuous`, `doc_ids`, `filter`, `query_params`.

Replication documents can have a user defined `_id`. Design documents
(and `_local` documents) added to the replicator database are ignored.

Basics
------

Let's say you PUT the following document into \_replicator:

~~~~ {.sourceCode .javascript}
{
  "_id": "my_rep",
  "source":  "http://myserver.com:5984/foo",
  "target":  "bar",
  "create_target":  true
}
~~~~

As soon as the replication is triggered, the document will be updated
with 3 new fields:

~~~~ {.sourceCode .javascript}
{
  "_id": "my_rep",
  "source":  "http://myserver.com:5984/foo",
  "target":  "bar",
  "create_target":  true,
  "_replication_id":  "c0ebe9256695ff083347cbf95f93e280",
  "_replication_state":  "triggered",
  "_replication_state_time":  "2011-06-07T16:54:35+01:00"
}
~~~~

**Note:** special fields set by the replicator start with the prefix
`_replication_`.

-   `_replication_id`: the ID internally assigned to the replication.
    This is the ID exposed by the output from `/_active_tasks/`;
-   `_replication_state`: the current state of the replication;
-   `_replication_state_time`: an RFC3339 compliant timestamp that tells
    us when the current replication state (defined in
    `_replication_state`) was set.

When the replication finishes, it will update the `_replication_state`
field (and `_replication_state_time`) with the value `"completed"`, so
the document will look like:

~~~~ {.sourceCode .javascript}
{
  "_id": "my_rep",
  "source":  "http://myserver.com:5984/foo",
  "target":  "bar",
  "create_target":  true,
  "_replication_id":  "c0ebe9256695ff083347cbf95f93e280",
  "_replication_state":  "completed",
  "_replication_state_time":  "2011-06-07T16:56:21+01:00"
}
~~~~

When an error happens during replication, the `_replication_state` field
is set to `"error"`.

There are only 3 possible values for the `_replication_state` field:
`"triggered"`, `"completed"` and `"error"`. Continuous replications
never get their state to `"completed"`.

Canceling replications
----------------------

To cancel a replication simply DELETE the document which triggered the
replication.

### Example

~~~~ {.sourceCode .bash}
$ curl -X DELETE http://username.cloudant.com/_replicator/replication1?rev=...
~~~~

*Note:* You need to DELETE the document that triggered the replication.
DELETEing another document that describes the same replication but did
not trigger it will not cancel the replication.

The *user\_ctx* property and delegations
----------------------------------------

Replication documents can have a custom `user_ctx` property. This
property defines the user context under which a replication runs. For
the old way of triggering replications (POSTing to `/_replicate/`), this
property was not needed (it didn't exist in fact) -this is because at
the moment of triggering the replication it has information about the
authenticated user. With the replicator database, since it's a regular
database, the information about the authenticated user is only present
at the moment the replication document is written to the database - the
replicator database implementation is like a `_changes` feed consumer
(with `?include_docs=true`) that reacts to what was written to the
replicator database - in fact this feature could be implemented with an
external script/program. This implementation detail implies that for non
admin users, a *user\_ctx* property, containing the user's name and a
subset of his/her roles, must be defined in the replication document.
This is ensured by the document update validation function present in
the default design document of the replicator database. This validation
function also ensure that a non admin user can set a user name property
in the `user_ctx` property that doesn't match his/her own name (same
principle applies for the roles).

For admins, the `user_ctx` property is optional, and if it's missing it
defaults to a user context with name *null* and an empty list of roles -
this means design documents will not be written to local targets. If
writing design documents to local targets is desired, then a user
context with the roles *\_admin* must be set explicitly.

Also, for admins the `user_ctx` property can be used to trigger a
replication on behalf of another user. This is the user context that
will be passed to local target database document validation functions.

**Note:** The `user_ctx` property only has effect for local endpoints.

Example delegated replication document:

~~~~ {.sourceCode .javascript}
{
  "_id": "my_rep",
  "source":  "http://bserver.com:5984/foo",
  "target":  "bar",
  "continuous":  true,
  "user_ctx": {
    "name": "joe",
    "roles": ["erlanger", "researcher"]
  }
}
~~~~

As stated before, for admins the `user_ctx` property is optional, while
for regular (non admin) users it's mandatory. When the roles property of
`user_ctx` is missing, it defaults to the empty list *[ ]*.

Performance related options
---------------------------

These options can be set per replication by including them in the
replication document.

-   `worker_processes` - The number of processes the replicator uses
    (per replication) to transfer documents from the source to the
    target database. Higher values can imply better throughput (due to
    more parallelism of network and disk IO) at the expense of more
    memory and eventually CPU. Default value is 4.

-   `worker_batch_size` - Workers process batches with the size defined
    by this parameter (the size corresponds to number of ''\_changes''
    feed rows). Larger batch sizes can offer better performance, while
    lower values imply that checkpointing is done more frequently.
    Default value is 500.

-   `http_connections` - The maximum number of HTTP connections per
    replication. For push replications, the effective number of HTTP
    connections used is min(worker\_processes + 1, http\_connections).
    For pull replications, the effective number of connections used
    corresponds to this parameter's value. Default value is 20.

-   `connection_timeout` - The maximum period of inactivity for a
    connection in milliseconds. If a connection is idle for this period
    of time, its current request will be retried. Default value is 30000
    milliseconds (30 seconds).

-   `retries_per_request` - The maximum number of retries per request.
    Before a retry, the replicator will wait for a short period of time
    before repeating the request. This period of time doubles between
    each consecutive retry attempt. This period of time never goes
    beyond 5 minutes and its minimum value (before the first retry is
    attempted) is 0.25 seconds. The default value of this parameter is
    10 attempts.

-   `socket_options` - A list of options to pass to the connection
    sockets. The available options can be found in the
    [[<http://www.erlang.org/doc/man/inet.html#setopts-2|documentation>
    for the Erlang function setopts/2 of the inet module]]. Default
    value is `[{keepalive, true}, {nodelay, false}]`.

### Example

~~~~ {.sourceCode .http}
POST /_replicate HTTP/1.1
~~~~

~~~~ {.sourceCode .javascript}
{
  "source": "example-database",
  "target": "http://example.org/example-database",
  "connection_timeout": 60000,
  "retries_per_request": 20,
  "http_connections": 30
}
~~~~

As for monitoring progress, the active tasks API was enhanced to report
additional information for replication tasks. Example:

~~~~ {.sourceCode .bash}
$ curl http://username.cloudant.com/_active_tasks
~~~~

~~~~ {.sourceCode .javascript}
[
  {
    "pid": "<0.1303.0>",
    "replication_id": "e42a443f5d08375c8c7a1c3af60518fb+create_target",
    "checkpointed_source_seq": 17333,
    "continuous": false,
    "doc_write_failures": 0,
    "docs_read": 17833,
    "docs_written": 17833,
    "missing_revisions_found": 17833,
    "progress": 3,
    "revisions_checked": 17833,
    "source": "http://username.cloudant.com/db/",
    "source_seq": 551202,
    "started_on": 1316229471,
    "target": "test_db",
    "type": "replication",
    "updated_on": 1316230082
  }
]
~~~~
