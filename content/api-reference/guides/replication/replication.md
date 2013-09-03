Replication using the /\_replicate API
======================================

Replication can be triggered by sending a POST request to the
`/_replicate` URL. Many of the concepts and parameters are similar, but
you are encouraged to use the replicator-database instead of the old API
documented here.

The body of the POST request is a JSON document with the following
fields:

  -------------------------------------------------------------------------
  Field  Req Description
  Name   uir 
         ed  
  ------ --- --------------------------------------------------------------
  `sourc yes Identifies the database to copy revisions from. Can be a
  e`         database URL, or an object whose `url` property contains the
             database name or URL.

  `targe yes Identifies the database to copy revisions to. Same format and
  t`         interpretation as source.

  `cance no  Include this property with a value of `true` to cancel an
  l`         existing replication between the specified `source` and
             `target`.

  `conti no  A value of `true` makes the replication ''continuous'' (see
  nuous`     below for details.)

  `creat no  A value of `true` tells the replicator to create the target
  e_targ     database if it doesn't exist.
  et`        

  `doc_i no  Array of document IDs; if given, only these documents will be
  ds`        replicated.

  `filte no  Name of a "filter function" that can choose which revisions
  r`         get replicated. cc

  `proxy no  Proxy server URL.
  `          

  `query no  Object containing properties that are passed to the filter
  _param     function.
  s`         

  `use_c no  Whether to create checkpoints. Checkpoints greatly reduce the
  heckpo     time and resources needed for repeated replications. Setting
  ints`      this to false removes the requirement for write access to the
             source database. Defaults to true.
  -------------------------------------------------------------------------

The `source` and a `target` fields indicate the databases that documents
will be copied from and to, respectively. Unlike CouchDB, you should
only use the **full URL** of the database.

~~~~ {.sourceCode .http}
POST /_replicate HTTP/1.1
~~~~

~~~~ {.sourceCode .javascript}
{
  "source": "http://username.cloudant.com/example-database",
  "target": "http://example.org/example-database"
}
~~~~

The target database has to exist and is not implicitly created. Add
`"create_target":true` to the JSON object to create the target database
(remote or local) prior to replication. The names of the source and
target databases do not have to be the same.

Canceling replication
---------------------

A replication triggered by POSTing to `/_replicate/` can be canceled by
POSTing the exact same JSON object but with the additional `cancel`
property set to `true`.

~~~~ {.sourceCode .http}
POST /_replicate HTTP/1.1
~~~~

~~~~ {.sourceCode .javascript}
{
  "source": "example-database",
  "target": "http://example.org/example-database",
  "cancel": true
}
~~~~

Notice: the request which initiated the replication will fail with error
500 (shutdown).

The replication ID can be obtained from the original replication request
(if it's a continuous replication) or from `/_active_tasks`.

### Example

First we start the replication.

~~~~ {.sourceCode .bash}
$ curl -H 'Content-Type: application/json' -X POST http://username.cloudant.com/_replicate \
  -d '{
        "source": "http://example.com/foo", 
        "target": "http://username.cloudant.com/bar", 
        "create_target": true, 
        "continuous": true
      }'
~~~~

The reply contains an id.

~~~~ {.sourceCode .javascript}
{
  "ok": true,
  "_local_id": "0a81b645497e6270611ec3419767a584+continuous+create_target"
}
~~~~

We use this id to cancel the replication.

~~~~ {.sourceCode .bash}
$ curl -H 'Content-Type: application/json' -X POST http://username.cloudant.com/_replicate \
  -d '{
        "replication_id": "0a81b645497e6270611ec3419767a584+continuous+create_target",
        "cancel": true
      }'
~~~~

The `"ok": true` reply indicates that the replication was successfully
canceled.

~~~~ {.sourceCode .javascript}
{
  "ok": true,
  "_local_id": "0a81b645497e6270611ec3419767a584+continuous+create_target"
}
~~~~

Continuous replication
----------------------

To make replication continuous, add a `"continuous":true` parameter to
the JSON, for example:

~~~~ {.sourceCode .bash}
$ curl -H 'Content-Type: application/json' -X POST http://username.cloudant.com/_replicate \
  -d '{
        "source": "http://example.com/foo", 
        "target": "http://username.cloudant.com/bar", 
        "continuous": true
      }'
~~~~

Replications can be persisted, so that they survive server restarts. For
more, see replicator-database.

Filtered Replication
--------------------

Sometimes you don't want to transfer all documents from source to
target. You can include one or more filter functions in a design
document on the source and then tell the replicator to use them.

A filter function takes two arguments (the document to be replicated and
the the replication request) and returns true or false. If the result is
true, the document is replicated.

~~~~ {.sourceCode .javascript}
function(doc, req) {
  return !!(doc.type && doc.type == "foo");
}
~~~~

Filters live under the top-level "filters" key;

~~~~ {.sourceCode .javascript}
{
  "_id": "_design/myddoc",
  "filters": {
    "myfilter": "function goes here"
  }
}
~~~~

Invoke them as follows:

~~~~ {.sourceCode .javascript}
{
  "source": "http://example.org/example-database",
  "target": "http://user:pass@username.cloudant.com/example-database",
  "filter": "myddoc/myfilter"
}
~~~~

You can even pass arguments to them.

~~~~ {.sourceCode .javascript}
{
  "source": "http://example.org/example-database",
  "target": "http://user:pass@username.cloudant.com/example-database",
  "filter": "myddoc/myfilter",
  "query_params": {
    "key": "value"
  }
}
~~~~

Named Document Replication
--------------------------

Sometimes you only want to replicate some documents. For this simple
case you do not need to write a filter function. Simply add the list of
keys in the doc\_ids field.

~~~~ {.sourceCode .javascript}
{
  "source": "http://example.org/example-database",
  "target": "http://admin:password@127.0.0.1:5984/example-database",
  "doc_ids": ["foo", "bar", "baz]
}
~~~~

Replicating through a proxy
---------------------------

Pass a "proxy" argument in the replication data to have replication go
through an HTTP proxy:

~~~~ {.sourceCode .http}
POST /_replicate HTTP/1.1
~~~~

~~~~ {.sourceCode .javascript}
{
  "source": "http://username.cloudant.com/example-database",
  "target": "http://example.org/example-database",
  "proxy": "http://my-proxy.com:8888"
}
~~~~

Authentication
--------------

The remote database may require authentication, especially if it's the
target because the replicator will need to write to it. The easiest way
to authenticate is to put a username and password into the URL; the
replicator will use these for HTTP Basic auth:

~~~~ {.sourceCode .javascript}
{
  "source": "https://myusername:mypassword@example.com/db", 
  "target": "https://cloudantuser:cloudantpassword@username.cloudant.com/db"
}
~~~~
