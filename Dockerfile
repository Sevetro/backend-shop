FROM node:14 AS base
WORKDIR /app
COPY ./package.json ./

FROM base AS dev
RUN npm install \
 && rm -rf /var/lib/apt/lists/*
CMD ["npm", "run", "dev"]

FROM base AS prod
RUN npm install --only=production \
 && rm -rf /var/lib/apt/lists/*

COPY ./build ./
COPY ./public ./public
CMD ["node", "./index.js"]
