FROM node:16-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fontconfig \
  libx11-dev \
  libx11-6 \
  libxext6 \
  libxrender1 \
  libxtst6 \
  libnss3 \
  libgdk-pixbuf2.0-0 \
  libgbm-dev \
  && apt-get clean

# Install Puppeteer
RUN npm install puppeteer --save

WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the code
COPY . .

# Expose the port for local testing (optional)
EXPOSE 3000

CMD ["node", "index.js"]
