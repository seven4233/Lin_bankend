FROM node

# COPY . /lin_bankend

# 需要改一下
WORKDIR /root/lin_bankend  

RUN npm i -g pnpm
RUN pnpm i
EXPOSE 3000
ENTRYPOINT [ "pnpm" , "start"]