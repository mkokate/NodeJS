FROM node:alpine
WORKDIR '/app/admin'
COPY package.json .
RUN npm install
COPY . .
EXPOSE 7600
CMD ["npm", "start"]