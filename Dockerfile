# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
FROM node:16.15.0 as build
#Label for temporary images
ARG REMOVE_TRIGGER
LABEL remove=${REMOVE_TRIGGER}

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install -g @angular/cli
RUN npm install --quiet

# Generate the build of the application'
ARG ENV_ARG
RUN ng build --configuration $ENV_ARG
RUN ls -l /usr/local/app/
RUN ls -l /usr/local/app/dist/
RUN ls -l /usr/local/app/dist/mw-frontend-v2

FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/local/app/dist/mw-frontend-v2 /usr/share/nginx/html

EXPOSE 80
