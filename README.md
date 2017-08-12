# ScrumDeck
ScrumDeck is an application that allows remotely distributed teams to perform estimation of stories. 
Each player casts their vote by clicking on a card. The players' votes will be hidden until all 
players have voted.

The server supports multiple concurrent games.

[![Build Status](https://travis-ci.org/joeattardi/scrum-deck.svg?branch=master)](https://travis-ci.org/joeattardi/scrum-deck)

![Screenshot](https://raw.githubusercontent.com/joeattardi/scrum-deck/master/screenshot.png)

## Demo

A demo can be found running at [https://scrumdeck.herokuapp.com](https://scrumdeck.herokuapp.com).

## Requirements
- Node.js 7 or later

## Getting started
First, install the project's dependencies:

    npm install

## Building
The client code must be built before the app can be run. To build the client:

    npm run build

Note: This is an Angular CLI project, so all the usual commands and options are available. 

## Configuration
All configuration is done via environment variables. Before starting the server, you will need to set
the following environment variables:

 - `PORT` - The port to listen on (default: `9000`)
 - `BASE_URL` - The base URL that the server will be running at. This should be specified _without_
 the trailing slash, for example `http://localhost:9000`.

## Development server
The development server will watch the client and server code. Whenever the server code changes, the
server will be restarted. Whenever the client code changes, it will be rebuilt.

    npm run start:dev

## Starting server
To start the server:

    npm start

or

    node server/index.js

## Running tests

    npm test