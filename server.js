const express = require('express');
const app = express();
const {join} = require('path');
const {auth, claimIncludes} = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
  audience: 'https://www.test.com',
  issuerBaseURL: `https://dev-126m5i2rlnt4m3xf.us.auth0.com/`,
});

const requiredPermissions = claimIncludes.bind(null, 'permissions'); // This is necessary to support the direct-user permissions
const checkScopes = requiredPermissions('read:protected');

app.get('/api/open', function (req, res) {
  console.log("/api/open");
  res.json({
    message: "Open Endpoint"
  });
});

app.get('/api/members-only',
  jwtCheck, // require sign in
  function (req, res) {
    console.log("/api/members-only")
    res.json({
      message: 'Members Only Endpoint'
    });
  })

app.get('/api/protected',
  jwtCheck, //  require signed in
  checkScopes, // require permission - oauth scopes
  function (req, res) {
    console.log("/api/protected")
    res.json({
      message: 'Protected Endpoint'
    });
  });

app.use(express.static(join(__dirname, "public")));
app.listen(3000);
console.log('Listening on http://localhost:3000');
