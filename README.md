# Web app of [kasthanka.pet](https://kashtanka.pet)

[![Build Status](https://drone.k8s.grechka.family/api/badges/LostPetInitiative/WebApp/status.svg)](https://drone.k8s.grechka.family/LostPetInitiative/WebApp)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/LostPetInitiative/WebApp?sort=semver)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/lostpetinitiative/kashtanka-web-app?label=docker%20image&sort=semver)
![Docker Pulls](https://img.shields.io/docker/pulls/lostpetinitiative/kashtanka-web-app)

The application provides an interface between the human volunteers and the kashtanka.pet system. The volunteers can explore the pet cards stored in the system and search for the possible lost/found matches between them.

## The repo

The app is single page application (SPA) made with TypeScript + React + Webpack + CSCC toolchain, wrapped into Docker image.

It communicates with the REST APIs of the kashtanka.pet system.

All pull requests are [checked with CI automation](https://drone.k8s.grechka.family/LostPetInitiative/WebApp).

Built releases are automatically published to [Docker Hub](https://hub.docker.com/repository/docker/lostpetinitiative/kashtanka-web-app) and are ready to use.

## How to build

### Prerequisites
You will need to install the following prerequsites to build the repo
1. [Node 16.x](https://nodejs.org/)
2. [Yarn 2](https://yarnpkg.com/)

### Development build & debug
1. Change dir to the root of the repo
2. Install the dependencies by executing `yarn`
3. Start the development server by running `yarn start`.

If you want to query the original kashtanka.pet database (default behavior, can be overriden by constants in App.tsx), make sure that you run the development server on http://localhost:3000, as production REST APIs allow CORS requests only from this development URL.

### Production build
1. Change dir to the root of the repo
2. Install the dependencies by executing `yarn`
3. Create production bundle by running `yarn build`

### Docker
The `Dockerfile` in the root of the repo defines the Docker image that creates a production bundle and serves it with a lightweight static content HTTP server.
