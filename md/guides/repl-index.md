Replication
===========

Replication is an incremental, one-way process involving two databases,
a source and a destination. At the end of the replication process, all
latest revisions of documents in the source database are also in the
destination database and all documents that were deleted from the source
database are also deleted (if necessary) from the destination database.

The replication process only copies the latest revision of a document,
so all previous revisions that were only on the source database are not
copied to the destination database.
