FROM node:16-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY --from=build /usr/src/app/dist ./dist
# COPY .env ./

# ENV PORT 3000
# EXPOSE ${PORT}

CMD [ "node", "dist/src/app.js" ]