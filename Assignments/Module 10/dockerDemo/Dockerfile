FROM node:alpine
WORKDIR '/Users/maheshk/Learning/NodeJS/Assignments/Module10/app'
COPY package.json .
RUN npm install
COPY . .
EXPOSE 7600
CMD ["npm", "start"]