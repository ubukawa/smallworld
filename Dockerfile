FROM unvt/nanban:latest
WORKDIR /root

  RUN git clone https://github.com/ubukawa/smallworld &&\
  cd smallworld &&\
  npm install &&\
  yarn &&\
  cd ..
