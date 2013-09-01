How to monitor indexing and replication tasks
=============================================

Creating new indexes over lots of data or replicating a large database
can take quite a while. So how can you see whether your tasks are making
progress and when they will be completed? The \_active\_tasks endpoint
provides information about all ongoing tasks. However, if you start a
lot of tasks, some of them might be scheduled to run later and will not
show up under \_active\_tasks until they have been started.

In this guide we will talk about how to use the \_active\_tasks endpoint
to monitor long-running tasks. We will use curl to access the endpoint
and jq (a command-line JSON processor) to process the JSON response.

Since this is a task-focused tutorial, it will only cover what is needed
to accomplish this task. Please refer to the API documentation for a
complete reference.

curl and jq basics
------------------

To get all active tasks and format the output nicely, we call curl and
pipe the output to jq:

~~~~ {.sourceCode .bash}
curl 'https://username:password@username.cloudant.com/_active_tasks' | jq '.'
~~~~

jq lets you filter a list of documents by their field values, which
makes it easy to get all replication documents or just one particular
view indexing task you are interested in. Have a look at the detailed
manual to find out more!

How to monitor view builds and search indexes
---------------------------------------------

View indexes are being rebuilt when a design document is updated. An
update to just one of the views leads to all the views in the document
being rebuilt. However, search indexes are only rebuilt when their index
function is changed. For each search index that is being built and for
each design document whose views are changed, one task is created for
each replica of each shard in a cluster. For example, if there are 24
shards with 3 replicas each and you update 2 search indexes, 144 tasks
will be run.

To find all view indexing tasks, you pipe the curl output to jq and let
it filter the documents in the array by their type field.

~~~~ {.sourceCode .bash}
curl -s 'https://username:password@username.cloudant.com/_active_tasks' | jq '.[] | select(.type=="indexer")'
~~~~

The same works for search indexing tasks.

~~~~ {.sourceCode .bash}
curl ... | jq '.[] | select(.type=="search_indexer")'
~~~~

The output will be a list of JSON objects like this one:

~~~~ {.sourceCode .javascript}
{
  "total_changes": 6435,
  "started_on": 1371118332,
  "progress": 5,
  "user": "username",
  "updated_on": 1371118334,
  "type": "indexer",
  "node": "dbcore@db6.meritage.cloudant.net",
  "pid": "<0.16366.6103>",
  "changes_done": 364,
  "database": "shards/40000000-7fffffff/username/database",
  "design_document": "_design/ngrams"
 }
~~~~

To estimate the time needed until the indexing task is complete, you can
monitor the number of changes\_done and compare this value to
total\_changes. For instance, if changes\_done increases by 250 per
second and total\_changes is 1,000,000, the task will take about 66
minutes to complete. However, this is only an estimate. How long the
process will really take depends on:

> -   The time it takes to process each document. For instance, a view
>     might check the type of a document first and only emit new index
>     entries for one type.
> -   The size of the documents
> -   The current workload on the cluster

These factors combined can lead to your estimate being off by as much as
100%

You can extract the `changes_done` field using jq like this:

~~~~ {.sourceCode .bash}
curl ... | jq '.[] | select(.type=="search_indexer") | .changes_done'
~~~~

How to monitor replication
--------------------------

To find all replication tasks, you pipe the curl output to jq and let it
filter the documents in the array by their type field.

~~~~ {.sourceCode .bash}
curl ... | jq '.[] | select(.type=="replication")'
~~~~

We recommend that you start a replication process by creating a document
in the \_replicator database and setting its \_id field. That makes it
easier to select the information about this process from the active
tasks:

~~~~ {.sourceCode .bash}
curl ... | jq '.[] | select(.doc_id==”ID”)'
~~~~

Alternatively, you can select by replication\_id:

~~~~ {.sourceCode .bash}
curl ... | jq '.[] | select(.replication_id==”ID”)'
~~~~

The output will look like this:

~~~~ {.sourceCode .javascript}
{
  "started_on": 1371094220,
  "source_seq": "62960-sakdjflksdfjsdlkafjalskdfjlsakfjlasdkjksald",
  "source": "",
  "revisions_checked": 12,
  "continuous": true,
  "doc_id": null,
  "doc_write_failures": 0,
  "docs_read": 12,
  "target": "",
  "type": "replication",
  "updated_on": 1371118477,
  "user": "username",
  "checkpointed_source_seq": "61764-dskfjalsfjsalkfjssadjfhasdfkjhsdkfhsdkf",
  "changes_pending": 1196,
  "pid": "<0.9955.4120>",
  "node": "dbcore@db7.meritage.cloudant.net",
  "docs_written": 12,
  "missing_revisions_found": 12,
  "progress": 98,
  "replication_id": "asfksdlfkjsadkfjsdalkfjas+continuous+create_target"
}
~~~~

### Is it stuck?

So what can you do with all this information? In the case on a one-off
(i.e. non-continuous) replication where the source database isn’t
updated a lot during the replication, the progress field tells you what
percentage of documents have been processed and is a good indicator of
when the replication will be finished. In the case of a continuous
replication, you will be more interested in how the number of documents
processed changes over time and whether changes\_pending increases. If
changes\_pending increases and revisions\_checked stays constant for a
while, the replication is probably stalled.

### What to do?

To resolve a stalled replication, it is sometimes necessary to cancel
the replication process and start it again. If that does not help, the
replication might be stalled because the user accessing the source or
target database does not have write permissions. Note that replication
makes use of checkpoints so that it doesn't have to repeat work if it is
triggered again. However, that means you need write permission on both
the target and the source. If you created the replication process by
creating a document in the \_replicator database, you can also check the
status of the replication there.
