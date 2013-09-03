API Reference
=============

Cloudant's database API is based on HTTP. If you know CouchDB, you
should feel right at home, as Cloudant's API is very similar. To access
your data on Cloudant, you connect to username.cloudant.com via HTTP or
HTTPS. For most requests, you will need to supply your user name or an
API key and a password. See api-authn for details. Cloudant uses the
JSON format for all documents in the database as well as for any
metadata. Thus, the request or response body of any HTTP request -
unless specified otherwise - has to be a valid JSON document. A good
place to start reading about the API and its basic building blocks is
the api-basics section.

This documentation is forked from the [Apache Couch
DB](http://couchdb.apache.org/) API Reference, due to the capabilities
Cloudant adds to the API. If you notice any problems with these docs,
please let us know at <support@cloudant.com>.
