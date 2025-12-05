FROM node:22-bullseye-slim
WORKDIR /app
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json ./
RUN npm install --no-audit --no-fund
# copy only app sources, exclude node_modules to prevent overwrite
COPY src ./src
COPY public ./public
COPY next.config.js ./
COPY jsconfig.json ./
COPY scripts ./scripts
COPY package.json ./
RUN npm run build
EXPOSE 3000
ENV SQLITE_DB_PATH=/data/sqlite/app.db \
    NODE_ENV=production
CMD ["npm", "start"]
