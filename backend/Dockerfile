
FROM node:18

WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
COPY --chown=app:app . /app
