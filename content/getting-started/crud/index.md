# Summary

Use our RESTful API to create, read, update and delete documents inside your hosted Cloudant database.

## Method Summary

* `{username}.cloudant.com`: Root URL for your account.
* `{username}.cloudant.com/_all_dbs`: List all your databases.
* `{username}.cloudant.com/{database}`: Root URL for a specific database. `GET` to get information about the database; `POST` to create a new document.
* `{username}.cloudant.com/{database}/_all_docs`: List all documents in the database. Takes the same query options as [secondary indexes](/getting-started/querying).
* `{username}.cloudant.com/{database}/{document_id}`: Read, update, or delete a single document, depending on the HTTP method used.
* `{username}.cloudant.com/{database}/_bulk_docs`: Insert, update, or delete multiple documents.
* `{username}.cloudant.com/{database}/{document_id}/{attachment_id}`: Create, read, or delete a file attached to a particular document, depending on the HTTP method used.