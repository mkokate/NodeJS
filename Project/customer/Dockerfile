FROM node:alpine
WORKDIR '/app/customer'
COPY package.json .
RUN npm install
COPY . .
EXPOSE 7200
CMD ["npm", "start"]