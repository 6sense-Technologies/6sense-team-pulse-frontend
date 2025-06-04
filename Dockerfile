FROM node:24-alpine

LABEL org.opencontainers.image.source="https://github.com/6sense-Technologies/6sense-team-pulse-frontend"

WORKDIR /app
COPY . .
RUN npm ci && npm run build

EXPOSE 4002
CMD ["npm", "start"]
