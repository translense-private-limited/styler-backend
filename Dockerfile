FROM node:latest

# set the default working directory inside the container
WORKDIR /app

# Copy package.* .
COPY package.* /app/
RUN npm install -g @nestjs/cli
RUN npm install -g npm@latest
RUN npm install --legacy-peer-deps

# absolute path
COPY . /app/

# its optional but good practice 
EXPOSE 3000

CMD ["npm", "run", "start:dev"]


