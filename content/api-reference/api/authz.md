Authorization Settings
======================

Cloudant's API allows you to read and modify the permissions of each
user. Users are either identified by their Cloudant username or by their
API key. You can also set permissions for unauthenticated users.

A list of the available methods and URL paths is provided below. Note
that the root URL is **<https://cloudant.com/>** rather than
**<https://username.cloudant.com/>**:

<table border="1" class="docutils">
  <colgroup>
    <col width="7%">
    <col width="36%">
    <col width="34%">
    <col width="24%">
  </colgroup>
  <thead valign="bottom">
    <tr class="row-odd">
      <th class="head">Method</th>
      <th class="head">Path</th>
      <th class="head">Description</th>
      <th class="head">Parameters</th>
    </tr>
  </thead>
  <tbody valign="top">
    <tr class="row-even">
      <td>POST</td>
      <td>
        <a class="reference external" href="https://cloudant.com/api/set_permissions">https://cloudant.com/api/set_permissions</a>
      </td>
      <td>Set permissions for a user and database</td>
      <td>database, username, roles[]</td>
    </tr>
    <tr class="row-odd">
      <td>POST</td>
      <td>
        <a class="reference external" href="https://cloudant.com/api/generate_api_key">https://cloudant.com/api/generate_api_key</a>
      </td>
      <td>Generate a random API key</td>
      <td>—</td>
    </tr>
  </tbody>
</table>

Setting permissions
-------------------

-   **Method**: `POST https://cloudant.com/api/set_permissions`
-   **Request Body**: Contains parameters as url-encoded form fields
-   **Response**: JSON document indicating success or failure
-   **Roles permitted**: admin

### Query Arguments

<table border="1" class="docutils">
  <colgroup>
    <col width="4%">
    <col width="29%">
    <col width="3%">
    <col width="2%">
    <col width="63%">
  </colgroup>
  <thead valign="bottom">
    <tr class="row-odd">
      <th class="head">Argument</th>
      <th class="head">Description</th>
      <th class="head">Optional</th>
      <th class="head">Type</th>
      <th class="head">Supported Values</th>
    </tr>
  </thead>
  <tbody valign="top">
    <tr class="row-even">
      <td>
        <tt class="docutils literal">
          <span class="pre">database</span>
        </tt>
      </td>
      <td>The database for which permissions are set. This has to be a string of the form “accountname/databasename”.</td>
      <td>no</td>
      <td>string</td>
      <td>&nbsp;</td>
    </tr>
    <tr class="row-odd">
      <td>
        <tt class="docutils literal">
          <span class="pre">username</span>
        </tt>
      </td>
      <td>The user name or API key for which permissions are set</td>
      <td>yes</td>
      <td>string</td>
      <td>&nbsp;</td>
    </tr>
    <tr class="row-even">
      <td>
        <tt class="docutils literal">
          <span class="pre">roles</span>
        </tt>
      </td>
      <td>The roles the user can have. This parameter can be passed multiple times for each role.</td>
      <td>no</td>
      <td>string</td>
      <td><tt class="docutils literal"><span class="pre">_admin</span></tt>: Gives the user all permissions, including setting permissions, <tt class="docutils literal"><span class="pre">_reader</span></tt>: Gives the user permission to read documents from the database, <tt class="docutils literal"><span class="pre">_writer</span></tt>: Gives the user permission to create and modify documents in the database</td>
    </tr>
  </tbody>
</table>

### Example Request

    POST /api/set_permissions HTTP/1.1
    Host: cloudant.com
    Content-Length: 83
    Content-Type: application/x-www-form-urlencoded

    username=aUserNameOrApiKey&database=accountName/db&roles=_reader&roles=_writer

### Example Response

  {
    "ok": true
  }

Generating an API Key
---------------------

-   **Method**: `POST https://cloudant.com/api/generate_api_key`
-   **Request Body**: Empty
-   **Response**: JSON document containing the generated key and
    password
-   **Roles permitted**: admin
-   **Query Arguments**: none

### Structure of the JSON document returned

-   **ok**: true if request was successful
-   **key**: String containing the generated key
-   **password**: String containing the generated password

### Example Request

    POST /api/generate_api_key HTTP/1.1
    Host: cloudant.com


### Example Response


    {
      "password": "generatedPassword",
       "ok": true,
       "key": "generatedKey"
    }
