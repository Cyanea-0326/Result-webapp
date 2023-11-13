FROM node:20.9.0 as build

WORKDIR /

COPY package*.json ./
RUN yarn install

COPY . .

# TypeScriptのビルド
RUN yarn run build

# 本番用の軽量なイメージ
FROM node:alpine

WORKDIR /

COPY --from=build /app/dist /app

# アプリケーションの起動
# CMD ["node", "app.js"]
