FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production

RUN npm install -g serve

# COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "8080"]
