## Basics

Baseline: initial objective assessment (considered failed if at least 1/3 of "No" responses, or above a certain percentage)

During each session, a cold probe is done once or a response is determined based on a percentage on at least ~10 tries, and comments/observations are written down

A target can be acquired after for example a "Yes" response in 3 consecutive sessions, or ~90% for ~3 consecutive sessions

When a target is acquired, a retention probe is done after about a one week break

## Features

React client & Node.js/Express backend with signup, user validation & login, data collection (sheets, targets, probes, comments), sheet access & edition rights management

## Main dependencies

- Client: react, redux, axios, react-router, semantic-ui
- Server: express, jsonwebtoken, sequelize, pg

## Build & deployment

- get project files on host (using git or rsync for example)
- set up the client  
  `(cd client && npm i && npm run build)`
- configure the db user and password  
  `nano server/.env`
- set up the server  
  `cd server`  
  `npm i && npm run build`
- run the app
  `node ./build/app.js`
