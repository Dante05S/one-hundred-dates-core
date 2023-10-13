FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache --update git \
  && npm install --only=production

COPY . ./

EXPOSE 3001

# Run the web service on container startup.
CMD [ "npm", "start" ]