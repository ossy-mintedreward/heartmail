# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
ARG NPM_TOKEN
RUN echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc

# Note that because of our use of yarn workspaces, we have no yarn.lock file to
# copy. There is a solution to this which is to use staged builds where we
# build everything at the top level and then include only things we need in the
# final build per module. See:
#
# https://github.com/yarnpkg/yarn/issues/5428#issuecomment-403722271
#
# COPY package.json yarn.lock ./
COPY package.json ./

RUN yarn install
RUN rm -f .npmrc

# Production image, copy all the files and run the main app
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S redirect-user -u 1001

COPY --from=deps /app/node_modules ./node_modules
COPY server.js ./server.js
COPY package.json ./package.json

USER redirect-user

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://redirect-user.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]
