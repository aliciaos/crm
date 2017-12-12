FROM ubuntu:16.04 
RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo bash -update
RUN sudo apt-get install nodejs
RUN npm install
RUN npm run-script migrate_local
RUN npm run-script seed_local
RUN npm run-script supervisor
EXPOSE 80
ENV CLOUDINARY_URL=cloudinary://672213164437813:sWjpOXdjZfbSr7e7Ok9lwfmm4fI@dihujkfxn
