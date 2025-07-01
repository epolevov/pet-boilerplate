# Install dependencies only when needed
FROM node:20.15-alpine as dependencies

ENV WORKDIR=/usr/src/app
RUN mkdir -p $WORKDIR
RUN mkdir -p $WORKDIR/node_modules

RUN apk add --no-cache libc6-compat
WORKDIR ${WORKDIR}

RUN addgroup -g 3000 -S appgroup && \
    adduser -u 2000 -S -G appgroup -h /home/appuser appuser && \
    apk update && \
    apk add --no-cache curl

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

USER root
RUN rm -rf /var/cache/apk/*

# Production image, copy all the files and run next
FROM node:20.15-alpine as runner
ENV WORKDIR=/usr/src/app
RUN apk add --no-cache dumb-init

WORKDIR ${WORKDIR}

# Copy installed dependencies from dependencies stage
COPY --from=dependencies ${WORKDIR}/node_modules ./node_modules

# Copy built application files
COPY ./ ./

# Set chown, chmod to all application files
# USER root
RUN chown -R 2000:3000 ${WORKDIR} && \
    chmod -R 755 ${WORKDIR}

USER 2000:3000

# Expose port
EXPOSE 8080

# If you are using the custom server implementation:
CMD ["dumb-init", "node", "./main.js"]