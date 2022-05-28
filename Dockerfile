FROM node:14.17.3-alpine3.14

# Create app directory
WORKDIR /app
# Copy the dist folder into the container
COPY ./package*.json .

RUN npm install --production

COPY ./dist/ .
# Run the project when the container runs
CMD [ "node", "index.js" ]

LABEL com.docker.compose.project=vsdbmv2