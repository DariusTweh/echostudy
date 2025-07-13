Cannot automatically write to dynamic config at: app.config.js
Add the following to app.config.js or app.json:

{
  "ios": {
    "infoPlist": {
      "ITSAppUsesNonExemptEncryption": false
    }
  }
}