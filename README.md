## Basics
baseline: initial objective assessment (>= 1/3 NO -> failed, OR x%)

each session: cold probe OR %age on at least ~10 tries, comments/observations

acquired when...: e.g. YES 3 consecutive sessions, ~90% for ~3 consec. sessions

when acquired, ~1 week break, then retention probe


## Features
- Sign up & login
- Sheets, targets, probes, comments


## TODO
- set up db (aws? elephantsql?)
- global store
- logging
- allow pdf export/print display
- improve rest api
- sort by last updated/last created
- suggestion after criterium met (retention after daily streak, daily after failed retention)
- ability to add comments/notes to existing probe, and to other therapists' probes as questions?
- auth0? (https://auth0.com/authenticate/react/google/)
- publish app online
- sequential "ids" for each target's comments/notes (local indices)
- tables horizontal scrolling
- collapsible baseline columns after first daily probe
- allow other therapists edition
- share with parents
- toggle isArchived?
- retention probe reminder after a week?
- after retention probe failed, suggest higher criterium?
- weekly cumulative graph for retention (add week's total and add new point), w/ condition change lines??
- internationalization
- offline mode
- https
- node-rate-limiter-flexible

targets summary table (beginning, end when done, "baseline"?), skills tracking sheet

-> cumulative graph (nb of targets achieved in the week)

PECS mands

## Notes
In case of PostgreSQL id conflict when inserting a new entry, do:
```sql
SELECT setval('TABLENAME_id_seq', (SELECT MAX(id) FROM "TABLENAME"));
```
