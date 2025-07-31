FROM node:24-alpine

LABEL org.opencontainers.image.source="https://github.com/6sense-Technologies/6sense-team-pulse-frontend"

WORKDIR /6sense-team-pulse-frontend
COPY . .
RUN npm ci && npm run build

EXPOSE 3000
CMD ["npm", "start"]
