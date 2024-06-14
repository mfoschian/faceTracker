FROM node

WORKDIR /srv/www/faceTracker

# ENV http_proxy=http://proxy.example.it:3128
# ENV https_proxy=http://proxy.example.it:3128

# Clone the github repository
RUN git clone https://github.com/mfoschian/faceTracker.git .

# RUN npm config set proxy ${http_proxy}
# RUN npm config set https-proxy ${https_proxy}

RUN npm install -g serve 

RUN npm install
RUN npm run build

EXPOSE 80

# By default start serve listening on port 5000 and serving build subfolder
CMD ["serve", "-s", "-l", "80" ,"dist"]
