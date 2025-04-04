FROM node:14

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Очищаем кэш и устанавливаем зависимости
RUN npm cache clean --force && npm install

# Копируем остальные файлы проекта
COPY . .

# Открываем порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]