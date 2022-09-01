FROM node:18 AS build
WORKDIR /repo
COPY . .
RUN yarn 
RUN yarn build

FROM abhin4v/hastatic:latest as final
WORKDIR /site

COPY --from=build /repo/dist .
CMD ["/usr/bin/hastatic"]