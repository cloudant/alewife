Authentication Methods
======================

Most requests require the credentials of a Cloudant account. There are
two ways to provide those credentials. They can either be provided using
HTTP Basic Auth or as an HTTP cookie named AuthSession. The cookie can
be obtained by performing a POST request to `/_session`. With the cookie
set, information about the logged in user can be retrieved with a GET
request and with a DELETE request you can end the session. Further
details are provided below.

<table border="1" class="docutils">
  <colgroup>
    <col width="6%">
    <col width="8%">
    <col width="34%">
    <col width="40%">
    <col width="13%">
  </colgroup>
  <thead valign="bottom">
    <tr class="row-odd"><th class="head">Method</th>
      <th class="head">Path</th>
      <th class="head">Description</th>
      <th class="head">Headers</th>
      <th class="head">Form Parameters</th>
    </tr>
  </thead>
  <tbody valign="top">
    <tr class="row-even"><td>GET</td>
      <td>/_session</td>
      <td>Returns cookie based login user information</td>
      <td>AuthSession cookie returned by POST request</td>
      <td>—</td>
    </tr>
    <tr class="row-odd"><td>POST</td>
      <td>/_session</td>
      <td>Do cookie based user login</td>
      <td>
        <tt class="docutils literal">
          <span class="pre">Content-Type:</span> 
          <span class="pre">application/x-www-form-urlencoded</span>
        </tt>
      </td>
      <td>name, password</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/_session</td>
      <td>Logout cookie based user</td>
      <td>AuthSession cookie returned by POST request</td>
      <td>—</td>
    </tr>
  </tbody>
</table>

Here is an example of the message body of a POST request to obtain the authentication
cookie.

    name=YourUserName&password=YourPassword

And this is the corresponding reply with the Set-Cookie header.

    200 OK
    Cache-Control: must-revalidate
    Content-Length: 42
    Content-Type: text/plain; charset=UTF-8
    Date: Mon, 04 Mar 2013 14:06:11 GMT
    server: CouchDB/1.0.2 (Erlang OTP/R14B)
    Set-Cookie: AuthSession="a2ltc3RlYmVsOjUxMzRBQTUzOtiY2_IDUIdsTJEVNEjObAbyhrgz"; Expires=Tue, 05 Mar 2013 14:06:11 GMT; Max-Age=86400; Path=/; HttpOnly; Version=1
    x-couch-request-id: a638431d

    {
      "ok": true,
      "name": "kimstebel",
      "roles": []
    }

Once you have obtained the cookie, you can make a GET request to obtain
the username and its roles:

The body of the reply looks like this:

To log out, you have to send a DELETE request to the same URL and sumbit
the Cookie in the request.

This will result in the following response.
