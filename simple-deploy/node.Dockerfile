FROM node:14-alpine


WORKDIR /code
COPY . ./


RUN yarn

EXPOSE 3000
CMD [ "npm", "start" ]