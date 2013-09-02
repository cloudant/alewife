## Update and delete documents

We've mentioned the `_rev` field a few times above. This gets added to your
documents by the server when you on insert or modify them, and is included in
the server response when you make changes or read a document. The `_rev` is
built from a crude counter and a hash of the document and is used to determine
what needs to be replicated between servers, and if a client is trying to
modify the latest version of a document. For this reason updates need to send
the `_rev` token to be able to modify a document.

It is important to note that `_rev` **should not** be used to build a version
control system, its an internal value used by the server and older revisions
are transient, and removed regularly.

The code or command line to update a document is the same as to insert, just
**be sure to include the `_rev` in the document body**.

As you might expect deletions are done by using the DELETE HTTP method. There
are some cases where firing a DELETE might not be possible so you can also
delete a document by adding `_deleted` to the document and update it. This is
especially useful for bulk operations, where many documents may be created,
updated or deleted in a single HTTP operation. As you'll be removing the
document you can delete the rest of its contents, apart from the `_id`, `_rev`
and `_deleted` fields. If you leave other fields they will be in the documents
"tombstone", this can be useful when replicating or validating document edits.