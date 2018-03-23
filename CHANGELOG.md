## CHANGELOG
### v1.6.2
- Added AWS/Travis CI/CD Pipeline.
- Added swap-space configuration in `./ebextensions`

### v1.6.1
- Hotfix for ejs file dist path for CSS and JS.

### v1.6.0
- Adding travis config file and updating base url.

### v1.5.10
- Updating the Header component to v2.4.5.

### v1.5.9
- Updating the Header component to v2.4.3.

### v1.5.8
- Updating the Header component to v2.4.2 and footer component to v0.4.1.

### v1.5.7
- Updating the Header component to v2.4.0.

### v1.5.6
- Updating the Header component to v2.3.0 -- Integrating Fundraising Banner.

### v1.5.5
- Updating the parameters for gaUtils.trackPageview() in App.jsx. It removed unnecessary parameters.

### v1.5.4
- Updating the Header to version 2.2.0.
- Updating GA initialization configurations.

### v1.5.3
- Adding hotfix for dist folder compiled files reference in the index html file.

### v1.5.2
- Adding redirect for the internal API endpoint to be able to filter.

### v1.5.1
- Updating the Header to version 2.1.1.

### v1.5.0
- XSS vulnerability fix.

### v1.4.1
- Updating the Header to version 2.1.0.

### v1.4.0
- Upgraded to React v15 and updating packages to specific versions.

### v1.3.5
#### Updated
- Updated the Header Component to v1.5.5. The updates include integrating the log in related functions with login server, removing console loggings for patron token expiration, and turning off the feature flag of OAuth Login and set it as default.

### v1.3.4
#### Updated
- Updated the Header Component to v1.5.1. The update includes HTTPS fix and the JavaScript fallback for the log in button on the Header Component.

### v1.3.3
#### Added
- Enabled Feature Flags plugin on the client-side and added Optimizely script in the index.ejs file.
