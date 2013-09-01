Miscellaneous Methods
=====================

The miscellaneous interface methods provide the basic interface for
obtaining server information and getting and setting configuration
information.

A list of the available methods and URL paths is provided below:

  ------------------------------------------------------------------------
  Method   Path            Description
  -------- --------------- -----------------------------------------------
  GET      /               Get the welcome message and version information

  GET      /\_active\_task Obtain a list of the tasks running in the
           s               server

  GET      /\_all\_dbs     Get a list of all the DBs

  POST     /\_replicate    Set or cancel replication

  GET      /\_uuids        Get generated UUIDs from the server
  ------------------------------------------------------------------------

Retrieving information about the server
---------------------------------------

-   **Method**: `GET /`
-   **Request**: None
-   **Response**: Welcome message and version
-   **Return Codes**:

    -   **200**: Request completed successfully.

Accessing the root returns meta information about the server. The
response is a JSON structure containing information about the server,
including a welcome message and the version of the server. The server
version describes the CouchDB version the server is compatible with,
whereas the cloudant\_build is the build number of Cloudant's CouchDb
implementation.

~~~~ {.sourceCode .javascript}
{
  "couchdb": "Welcome",
  "version": "1.0.2",
  "cloudant_build":"1138"
}
~~~~

Retrieving a list of active tasks
---------------------------------

-   **Method**: `GET /_active_tasks`
-   **Request**: None
-   **Response**: List of running tasks, including the task type, name,
    status and process ID
-   **Roles permitted**: \_admin
-   **Return Codes**:

    -   **200**: Request completed successfully.

You can obtain a list of active tasks by using the `/_active_tasks` URL.
The result is a JSON array of the currently running tasks, with each
task being described with a single object. For example:

~~~~ {.sourceCode .javascript}
[
  {
    "user": null,
    "updated_on": 1363274088,
    "type": "replication",
    "target": "https://repl:*****@tsm.cloudant.com/user-3dglstqg8aq0uunzimv4uiimy/",
    "docs_read": 0,
    "doc_write_failures": 0,
    "doc_id": "tsm-admin__to__user-3dglstqg8aq0uunzimv4uiimy",
    "continuous": true,
    "checkpointed_source_seq": "403-g1AAAADfeJzLYWBgYMlgTmGQS0lKzi9KdUhJMjTRyyrNSS3QS87JL01JzCvRy0styQGqY0pkSLL___9_VmIymg5TXDqSHIBkUj1YUxyaJkNcmvJYgCRDA5AC6tuflZhGrPsgGg9ANAJtzMkCAPFSStc",
    "changes_pending": 134,
    "pid": "<0.1781.4101>",
    "node": "dbcore@db11.julep.cloudant.net",
    "docs_written": 0,
    "missing_revisions_found": 0,
    "progress": 75,
    "replication_id": "d0cdbfee50a80fd43e83a9f62ea650ad+continuous",
    "revisions_checked": 0,
    "source": "https://repl:*****@tsm.cloudant.com/tsm-admin/",
    "source_seq": "537-g1AAAADfeJzLYWBgYMlgTmGQS0lKzi9KdUhJMjTUyyrNSS3QS87JL01JzCvRy0styQGqY0pkSLL___9_VmI9mg4jXDqSHIBkUj1WTTityWMBkgwNQAqob39WYhextkE0HoBoBNo4MQsAFuVLVQ",
    "started_on": 1363274083
  },
  {
    "user": "acceptly",
    "updated_on": 1363273779,
    "type": "indexer",
    "node": "dbcore@db11.julep.cloudant.net",
    "pid": "<0.20723.4070>",
    "changes_done": 189,
    "database": "shards/00000000-3fffffff/acceptly/acceptly_my_chances_logs_live.1321035717",
    "design_document": "_design/MyChancesLogCohortReport",
    "progress": 0,
    "started_on": 1363273094,
    "total_changes": 26389
  },
  {
    "user": "username",
    "updated_on": 1371118433,
    "type": "search_indexer",
    "total_changes": 5466,
    "node": "dbcore@db7.meritage.cloudant.net",
    "pid": "<0.29569.7037>",
    "changes_done": 4611,
    "database": "shards/40000000-7fffffff/username/database_name",
    "design_document": "_design/lucene",
    "index": "search1",
    "progress": 84,
    "started_on": 1371118426
  },
  {
    "view": 1,
    "user": "acceptly",
    "updated_on": 1363273504,
    "type": "view_compaction",
    "total_changes": 26095,
    "node": "dbcore@db11.julep.cloudant.net",
    "pid": "<0.21218.4070>",
    "changes_done": 20000,
    "database": "shards/80000000-bfffffff/acceptly/acceptly_my_chances_logs_live.1321035717",
    "design_document": "_design/MyChancesLogCohortReport",
    "phase": "view",
    "progress": 76,
    "started_on": 1363273094
  },
  {
    "updated_on": 1363274040,
    "node": "dbcore@db11.julep.cloudant.net",
    "pid": "<0.29256.4053>",
    "changes_done": 272195,
    "database": "shards/00000000-3fffffff/heroku/app3245179/id_f21a08b7005e_logs.1346083461",
    "progress": 100,
    "started_on": 1363272496,
    "total_changes": 272195,
    "type": "database_compaction"
  }
]
~~~~

The returned structure includes the following fields for each task:

> -   **pid**: Erlang Process ID
> -   **type**: Operation Type
> -   **updated\_on**: Time when the last update was made to this task
>     record. Updates are made by the job as progress occurs. The value
>     is in Unix time UTC.
> -   **started\_on**: Time when the task was started. The value is in
>     Unix time UTC.
> -   **total\_changes**: Total number of documents to be processed by
>     the task. The exact meaning depends on the type of the task.
> -   **progress**: changes\_done \* 100 / total\_changes
> -   **database**: The database (and shard) on which the operation
>     occurs

For the task's type, valid values include:

-   `database_compaction`
-   `replication`
-   `view_compaction`
-   `indexer`
-   `search_indexer`

You can find an example for each one above.

The meaning of the remaining fields depends on the type of the task.

### Replication tasks

> -   **replication\_id**: Unique identifier of the replication that can
>     be used to cancel the task
> -   **user**: User who started the replication
> -   **changes\_pending**: Number of documents needing to be changed in
>     the target database.
> -   **revisions\_checked**: Number of document revisions for which it
>     was checked whether they are already in the target database.
> -   **continuous**: Whether the replication is continuous
> -   **docs\_read**: Documents read from the source database

### Indexing tasks

> -   **design\_document**: The design document containing the view or
>     index function(s)
> -   **total\_changes**: Total number of unindexed changes from when
>     the MVCC snapshot is opened
> -   **changes\_done**: Number of document revisions processed by this
>     task. A document can have 1 or more revisions

### Compaction tasks

> -   **total\_changes**: Number of documents in the database
> -   **changes\_done**: Number of documents compacted
> -   **phase**: First the compactions happen for documents (phase
>     `ids`), then views are compacted (phase `views`).

Replicating a database
----------------------

-   **Method**: `POST /_replicate`
-   **Request**: Replication specification
-   **Response**: TBD
-   **Roles permitted**: \_admin

### Return Codes

  Code    Description
  ------- ---------------------------------------------------
  200     Replication request successfully completed
  202     Continuous replication request has been accepted
  404     Either the source or target DB is not found
  500     JSON specification was invalid

Request, configure, or stop, a replication operation.

The specification of the replication request is controlled through the
JSON content of the request. The JSON should be an object with the
fields defining the source, target and other options. The fields of the
JSON request are shown in the table below:

-   **cancel (optional)**: Cancels the replication
-   **continuous (optional)**: Configure the replication to be
    continuous
-   **create\_target (optional)**: Creates the target database
-   **doc\_ids (optional)**: Array of document IDs to be synchronized
-   **proxy (optional)**: Address of a proxy server through which
    replication should occur
-   **source**: Source database URL, including user name and password
-   **target**: Target database URL, including user name and password

### Replication Operation

The aim of the replication is that at the end of the process, all active
documents on the source database are also in the destination database
and all documents that were deleted in the source databases are also
deleted (if they existed) on the destination database.

Replication can be described as either push or pull replication:

-   *Pull replication* is where the `source` is the remote database
    instance, and the `destination` is the local database.

    Pull replication is the most useful solution to use if your source
    database has a permanent IP address, and your destination (local)
    database may have a dynamically assigned IP address (for example,
    through DHCP). This is particularly important if you are replicating
    to a mobile or other device from a central server.

-   *Push replication* is where the `source` is a local database, and
    `destination` is a remote database.

For example, to request replication between a database on the server
example.com, and a database on Cloudant you might use the following
request:

~~~~ {.sourceCode .http}
POST /_replicate
Content-Type: application/json
Accept: application/json

{
   "source" : "http://user:pass@example.com/db",
   "target" : "http://user:pass@user.cloudant.com/db",
}
~~~~

In all cases, the requested databases in the `source` and `target`
specification must exist. If they do not, an error will be returned
within the JSON object:

~~~~ {.sourceCode .javascript}
{
   "error" : "db_not_found"
   "reason" : "could not open http://username.cloudant.com/ol1ka/",
}
~~~~

You can create the target database (providing your user credentials
allow it) by adding the `create_target` field to the request object:

~~~~ {.sourceCode .http}
POST http://username.cloudant.com/_replicate
Content-Type: application/json
Accept: application/json

{
   "create_target" : true
   "source" : "http://user:pass@example.com/db",
   "target" : "http://user:pass@user.cloudant.com/db",
}
~~~~

The `create_target` field is not destructive. If the database already
exists, the replication proceeds as normal.

### Single Replication

You can request replication of a database so that the two databases can
be synchronized. By default, the replication process occurs one time and
synchronizes the two databases together. For example, you can request a
single synchronization between two databases by supplying the `source`
and `target` fields within the request JSON content.

~~~~ {.sourceCode .http}
POST /_replicate
Content-Type: application/json
Accept: application/json

{
   "source" : "http://user:pass@user.cloudant.com/recipes",
   "target" : "http://user:pass@user.cloudant.com/recipes2",
}
~~~~

In the above example, the databases `recipes` and `recipes2` will be
synchronized. The response will be a JSON structure containing the
success (or failure) of the synchronization process, and statistics
about the process:

~~~~ {.sourceCode .javascript}
{
   "ok" : true,
   "history" : [
      {
         "docs_read" : 1000,
         "session_id" : "52c2370f5027043d286daca4de247db0",
         "recorded_seq" : 1000,
         "end_last_seq" : 1000,
         "doc_write_failures" : 0,
         "start_time" : "Thu, 28 Oct 2010 10:24:13 GMT",
         "start_last_seq" : 0,
         "end_time" : "Thu, 28 Oct 2010 10:24:14 GMT",
         "missing_checked" : 0,
         "docs_written" : 1000,
         "missing_found" : 1000
      }
   ],
   "session_id" : "52c2370f5027043d286daca4de247db0",
   "source_last_seq" : 1000
}
~~~~

The structure defines the replication status, as described in the table
below:

-   **history [array]**: Replication History

    -   **doc\_write\_failures**: Number of document write failures
    -   **docs\_read**: Number of documents read
    -   **docs\_written**: Number of documents written to target
    -   **end\_last\_seq**: Last sequence number in changes stream
    -   **end\_time**: Date/Time replication operation completed
    -   **missing\_checked**: Number of missing documents checked
    -   **missing\_found**: Number of missing documents found
    -   **recorded\_seq**: Last recorded sequence number
    -   **session\_id**: Session ID for this replication operation
    -   **start\_last\_seq**: First sequence number in changes stream
    -   **start\_time**: Date/Time replication operation started

-   **ok**: Replication status
-   **session\_id**: Unique session ID
-   **source\_last\_seq**: Last sequence number read from source
    database

### Continuous Replication

Synchronization of a database with the previously noted methods happens
only once, at the time the replicate request is made. To have the target
database permanently replicated from the source, you must set the
`continuous` field of the JSON object within the request to true.

With continuous replication changes in the source database are
replicated to the target database in perpetuity until you specifically
request that replication ceases.

~~~~ {.sourceCode .http}
POST /_replicate
Content-Type: application/json
Accept: application/json

{
   "continuous" : true
   "source" : "http://user:pass@example.com/db",
   "target" : "http://user:pass@user.cloudant.com/db",
}
~~~~

Changes will be replicated between the two databases as long as a
network connection is available between the two instances.

> **note**
>
> To keep two databases synchronized with each other, you need to set
> replication in both directions; that is, you must replicate from
> `databasea` to `databaseb`, and separately from `databaseb` to
> `databasea`.

### Canceling Continuous Replication

You can cancel continuous replication by adding the `cancel` field to
the JSON request object and setting the value to true. Note that the
structure of the request must be identical to the original for the
cancellation request to be honoured. For example, if you requested
continuous replication, the cancellation request must also contain the
`continuous` field.

For example, the replication request:

~~~~ {.sourceCode .http}
POST /_replicate
Content-Type: application/json
Accept: application/json

{
   "source" : "http://user:pass@example.com/db",
   "target" : "http://user:pass@user.cloudant.com/db",
   "create_target" : true,
   "continuous" : true
}
~~~~

Must be canceled using the request:

~~~~ {.sourceCode .http}
POST /_replicate
Content-Type: application/json
Accept: application/json

{
    "cancel" : true,
    "continuous" : true
    "create_target" : true,
    "source" : "http://user:pass@example.com/db",
    "target" : "http://user:pass@user.cloudant.com/db",
}
~~~~

Requesting cancellation of a replication that does not exist results in
a 404 error.

Retrieving UUIDs
----------------

-   **Method**: `GET /_uuids`
-   **Request**: None
-   **Response**: List of UUIDs

### Query Argument

  Argument    Description                  Optional    Type
  ----------- ---------------------------- ----------- -----------
  `count`     Number of UUIDs to return    yes         numeric

Requests one or more Universally Unique Identifiers (UUIDs). The
response is a JSON object providing a list of UUIDs. For example:

~~~~ {.sourceCode .javascript}
{
   "uuids" : [
      "7e4b5a14b22ec1cf8e58b9cdd0000da3"
   ]
}
~~~~

You can use the `count` argument to specify the number of UUIDs to be
returned. For example:

~~~~ {.sourceCode .http}
GET /_uuids?count=5
~~~~

Returns:

~~~~ {.sourceCode .javascript}
{
   "uuids" : [
      "c9df0cdf4442f993fc5570225b405a80",
      "c9df0cdf4442f993fc5570225b405bd2",
      "c9df0cdf4442f993fc5570225b405e42",
      "c9df0cdf4442f993fc5570225b4061a0",
      "c9df0cdf4442f993fc5570225b406a20"
   ]
}
~~~~

For example, changing the UUID type to `random`:

~~~~ {.sourceCode .http}
PUT /_config/uuids/algorithm
Content-Type: application/json
Accept: */*

"random"
~~~~

When obtaining a list of UUIDs:

~~~~ {.sourceCode .javascript}
{
   "uuids" : [
      "031aad7b469956cf2826fcb2a9260492",
      "6ec875e15e6b385120938df18ee8e496",
      "cff9e881516483911aa2f0e98949092d",
      "b89d37509d39dd712546f9510d4a9271",
      "2e0dbf7f6c4ad716f21938a016e4e59f"
   ]
}
~~~~
