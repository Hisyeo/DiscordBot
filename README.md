# Hîsyêô Discord Bot

This project contains a bot for Hisyëö servers. It can:

- translate latin script into Hisyëö writing systems
- locate and present details about specific Hisyëö words
- search, vote and propose kennings.

Read the **[Hîsyêô documentation](https://hisyeo.github.io/docs/intro)** for lessons and reference materials about this world language.

## Prerequisites

To get best use out of this project you'll ideally be familiar with JavaScript and have a little Node.js experience–check out [Hello Node](https://glitch.com/~glitch-hello-node) if you haven't already!

## What's in this project?

← `README.md`: That’s this file, where you can tell people what your cool bot does and how you built it.

← `package.json`: The NPM packages for your project's dependencies.

← `.env`: The environment is cleared when you initially remix the project, but you will add a new env variable value when you set up an admin key.

← `app.js` contains the express server

← `commands.js` contains the functions for each command

← `middleware.js` contains the express logger

← `register.js` is a script to register the api with Discord

← `utils.js` is where all the real work happens