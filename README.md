# Transcendence

<br>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/jmz-mzr/transcendence/assets/60391881/6c1da3b2-2c9d-4038-9f07-f88512a82329">
    <img alt="Transcendence Logo: 'Pong' written with purple flashing neon letters" src="https://github.com/jmz-mzr/transcendence/assets/60391881/e9ee9a11-56de-4713-956c-7e3482f49cc3">
  </picture>
</p>

<details align="center">
<summary><b>Table of Contents</b></summary>
<div align="left">
<br>

- [Overview](#overview)
- [Key Features](#key-features)
  - [Video](#video)
- [Usage](#usage)
- [A word on Docker & Security](#docker-and-security)
- [Login & Configuration](#login-and-configuration)
- [Contributing](#contributing)

</div>
</details>

<br>

## Overview

Transcendence revives the great and venerable “[Pong](https://www.ponggame.org/)“ game, in a modern single-page application.

Enjoy real-time matches & chat within a stunning user interface, take over the world with your arrow-key-press skills, and achieve the mythical perfect stats! 🏓

Written with love in [TypeScript](https://www.typescriptlang.org/), using [NestJS](https://nestjs.com/), [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/orm) ||| [Next.JS](https://nextjs.org/), [React](https://react.dev/), and [Axios](https://axios-http.com/docs/intro) with [ReactQuery](https://tanstack.com/query/v4/docs/framework/react/overview).

<br>

## Key Features

- Real-time gameplay with smooth performance via [Socket.IO](https://socket.io/)'s WebSockets
- User profiles with customizable usernames and avatars
- Local and Online modes
- Matchmaking [algorithm](https://github.com/jmz-mzr/transcendence/blob/main/back-end/src/game/room.service.ts#L193-L281) for competitive games
- Match history and player stats tracking
- Secret achievements for outstanding players
- Challenge your friends, or watch their game in real-time
- Real-time chat with public, private, and password-protected channels
- Advanced [user & channel management](https://github.com/jmz-mzr/transcendence/blob/main/back-end/src/channel/channel.service.ts#L674-L952) features
- Block, kick, ban or mute others
- [Dockerized environment](https://github.com/jmz-mzr/transcendence/tree/main/docker) for security and efficiency
- Two-factor authentication
- Strict CORS policy and [class-validators](https://github.com/typestack/class-validator) for secure API communication
- OAuth sign-in through the 42 network

<span id="video"></span>
<br>

<div align="center">
  <video src="https://github.com/jmz-mzr/transcendence/assets/60391881/adc7fb6e-ea68-4230-aa34-9b9c8fc30a61" height="1080" width="1920" />
</div>

<br>

## Usage

```sh
# Development mode
./start-dev.sh

# Production mode
./start-prod.sh
```

They both call this [`script`](https://github.com/jmz-mzr/transcendence/blob/main/docker/check_and_setup_env) to create the `.env` file if you haven’t, and ensure it is complete. If needed, they create strong passwords using [OpenSSL](https://www.openssl.org/docs/man1.1.1/man1/rand.html).  
They also make sure [Husky](https://typicode.github.io/husky/) and [Lint-Staged](https://github.com/lint-staged/lint-staged) are set to lint the files and enforce code quality before every commit.

The major differences in dev mode are the [ReactQueryDevTools](https://tanstack.com/query/v4/docs/framework/react/devtools), and the continuous incremental compilation when a file change is detected.

To make the development easier and secure, the [`prima_migrate_dev.sh`](https://github.com/jmz-mzr/transcendence/blob/main/docker/scripts/prisma_migrate_dev.sh) script records your database migrations in the mounted [`prisma`](https://github.com/jmz-mzr/transcendence/tree/main/back-end/prisma) folder through the Docker container.

Control your paddle in games with the `Up` / `Down` arrow keys (or `W` / `S` in local two-player mode). Chat, challenge friends, and climb the leaderboard to achieve Pong mastery!

<br>

<span id="docker-and-security"></span>

## A word on Docker & Security

Both the [`front`](https://github.com/jmz-mzr/transcendence/blob/main/docker/services/web-node/Dockerfile) and [`back`](https://github.com/jmz-mzr/transcendence/blob/main/docker/services/api-node/Dockerfile) Docker images leverage multi-stage builds, making them smaller and more secure.

They run as custom unprivileged users, and use Docker Secrets through the [`docker-compose`](https://github.com/jmz-mzr/transcendence/blob/main/docker/docker-compose.yml) files to withdraw sensitive informations from the images history, the containers environment, and the `docker inspect <...>` command.

They use [dumb-init](https://github.com/Yelp/dumb-init) to avoid `node` running as PID 1, and ensure proper signal forwarding & zombie processes reaping.  
Also, custom & secure [`healthchecks`](https://github.com/jmz-mzr/transcendence/blob/main/docker/services/api-node/healthcheck.js) report the containers’ status - no need of additional tools!

While we're at it:

- A strict CORS policy and [class-validators](https://github.com/typestack/class-validator) with a whitelist-only property secure the RESTful API
- Channel passwords are stored hashed using the [bcrypt](https://www.npmjs.com/package/bcrypt) library
- For the DB, [Prisma](https://www.prisma.io/orm) takes care of the requests to properly avoid SQL injections
- A secure 2FA login can be enabled with your favorite authenticator app!

<br>

<span id="login-and-configuration"></span>

## Login & Configuration

To build and use the app, you need a complete `.env` file alongside the [`.env.example`](https://github.com/jmz-mzr/transcendence/blob/main/docker/.env.example). The script called on startup will help you with it (see [Usage](#usage)).

Register a new app on [42’s API](https://profile.intra.42.fr/oauth/applications), providing this redirect URI: `http://<YOUR_SERVER_IP>:3000/auth/42/callback`, where `YOUR_SERVER_IP` is the network address of your machine hosting the app (or `localhost` for a local version only).
Copy the `APP_ID` and `APP_SECRET` into the `.env` file, and give secret values to other empty variables.

Users sign into the app with the OAuth system of the 42 school. There are currently no other connection method. If you’d like to see it coming, as the saying goes: “ask and you shall receive“!

If you are not part of the 42 network, the [video](#video) will give you a good idea of the project. And for testing purposes, it’s easy to implement [another passport method](https://docs.nestjs.com/recipes/passport) with username / password combination, or using [sign-in with Google](https://dev.to/chukwutosin_/implement-google-oauth-in-nestjs-using-passport-1j3k).

<br>

## Contributing

Interested in adding features or fixing bugs? Feel free to fork the repository, make changes, and submit a pull request!

And of course the last part of this manual: `Have fun!` 🥳
