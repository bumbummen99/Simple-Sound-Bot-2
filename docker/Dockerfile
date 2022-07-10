# Create the general environment for the Bot
FROM node:latest as environment

# Install dependencies
#RUN apt-get update \
#    && apt-get install my-dep

# Create bot directory
RUN mkdir -p /bot
WORKDIR /bot

# Run the application as user node (1000)
USER node
CMD [ "npm", "run", "start" ]

# Build the Docker image including the Bot source
FROM environment as production

USER root

# Add the source
ADD ./ /bot

RUN chown -R node:node /bot

# Switch to user node (1000) to prevent incorrect file permissions
USER node

# Install for production
RUN npm install --omit=dev