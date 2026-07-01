# AlphaChart

Easily create Alphabet Charts.

# Introduction

This is a web-based tool that allows users to create Alphabet Charts visually without a desktop publishing tool. Users can choose the letters, formatting options, and images to accompany each letter. It can export a PNG or PDF of the chart.

# Requirements

You need mongodb
Use yarn berry, not classic yarn
Works with Node 24

# Running locally

After cloning:

1. `yarn install` in root dir
1. `yarn install` in `./client` dir.
1. Start it up.

```shell
yarn start
```
# Run the tests

## Unit Tests

`yarn test`

## e2e or functional tests

`yarn cypress:run`

or if you'd like to run through cypress visually use:

`yarn cypress:open`

if you are running the cypress tests another way, use `yarn start-test` to set up the app first.

# Caveats

There are other details not included,
Good luck!
