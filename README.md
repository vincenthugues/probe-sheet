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
- ability to add comments/notes to existing probe, and to other therapists' probes as questions?
- set up db (aws? elephantsql?)
- allow pdf export/print display
- share with parents
- testing
- logging
- inject user role by sheet on backend side?
- reselect
- sort by last updated/last created
- publish app online
- sequential "ids" for each target's comments/notes (local indices)
- tables horizontal scrolling
- collapsible baseline columns after first daily probe
- weekly cumulative graph for retention, with nb of targets achieved in the week (add week's total and add new point), with condition change lines?
- suggestion after criterium met (retention after daily streak, daily after failed retention)
- retention probe reminder after a week
- after retention probe failed, suggest higher criterium?
- improve rest api
- toggle isArchived?
- auth0? (https://auth0.com/authenticate/react/google/)
- dark theme
- internationalization
- offline mode
- https
- node-rate-limiter-flexible
- targets summary table (beginning, end when done, retention), on a skills tracking sheet?
- PECS mands

## Notes
In case of PostgreSQL id conflict when inserting a new entry, do:
```sql
SELECT setval('TABLENAME_id_seq', (SELECT MAX(id) FROM "TABLENAME"));
```
