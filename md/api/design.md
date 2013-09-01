Design Document Methods
=======================

Design documents provide the main interface for building an application
with Cloudant. The design document defines the views and indexers used
to extract information from the database. Design documents are created
in the same way as you create other database documents, but the content
and definition of the documents is different. Design documents are named
using an ID defined with the design document URL path, and this URL can
then be used to access the database contents.

Views and lists operate together to provide automated (and formatted)
output from your database. Indexers are used with Cloudant's
Lucene-based search functions.
