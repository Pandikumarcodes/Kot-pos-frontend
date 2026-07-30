# Security Policy

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Report it privately
to the repository maintainers through the hosting platform's private security
advisory feature. Include affected versions, reproduction steps, impact, and
any suggested mitigation.

Maintainers should acknowledge a report within five business days and provide
status updates until remediation or closure.

## Supported versions

Until tagged releases are published, only the latest commit on the default
branch is supported.

## Security boundaries

Client-side authentication and role guards are defense-in-depth controls only.
The backend must validate sessions, roles, resource ownership, and every
state-changing request. Never place secrets in variables prefixed with
`VITE_`; those values are embedded in browser bundles.
