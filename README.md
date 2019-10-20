## Basics
The baseline is the initial objective assessment (considered failed if at least 1/3 of "No" responses, or above a certain percentage)

During each session, a cold probe is done once or a response is determined based on a percentage on at least ~10 tries, and comments/observations are written down

A target can be acquired after for example a "Yes" response in 3 consecutive sessions, or ~90% for ~3 consecutive sessions

When a target is acquired, a retention probe is done after about a one week break


## Features
React client & Node.js/Express backend with signup & login, data collection (sheets, targets, probes, comments), sheet access & edition rights management


## Main dependencies
- Client: react, redux, axios, react-router, ramda, styled-components
- Server: express, jsonwebtoken, sequelize, pg, dotenv


## TODO
- new user validation
- email validation
- automatically toggle isArchived
- publish app
- set up db (aws? elephantsql?)
- ability to add comments/notes to existing probe, and to other therapists' probes as questions?
- allow pdf export/print display
- highlight potential probe's comments while hovering over probe's column
- allow creating a new "version" of a target, with a link showing the history of previous versions in a read-only state
- allow soft deletion of targets, probes, comments
- allow editing targets, probes, comments
- allow putting a target "on hold"?
- once a target is created, a record is added to the skills tracking sheet
- add each skill to skills tracking sheet (beginning, end when done, retention)
- share with parents (without signing up?)
- PECS mands
- better testing
- logging
- inject user role by sheet on backend side?
- sort by last updated/last created
- sequential "ids" for each target's comments/notes (local indices)
- reselect
- retention probe reminder after a week
- weekly cumulative graph for retention, with nb of targets achieved in the week (add week's total and add new point), with condition change lines?
- suggestion after criterium met (retention after daily streak, daily after failed retention)
- tables horizontal scrolling
- collapsible baseline columns after first daily probe
- after retention probe failed, suggest higher criterium?
- reCAPTCHA v2/v3?
- improve rest api
- auth0? (https://auth0.com/authenticate/react/google/)
- dark theme
- internationalization
- offline mode
- https
- node-rate-limiter-flexible
