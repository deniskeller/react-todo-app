# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Порт, который будет использоваться приложением
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "run", "dev"]