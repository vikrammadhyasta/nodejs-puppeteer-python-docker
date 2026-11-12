FROM node:18-slim AS scraper

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./

RUN npm install --omit=dev

COPY scrape.js ./

ARG SCRAPE_URL

RUN test -n "$SCRAPE_URL" && \
    SCRAPE_URL="$SCRAPE_URL" node scrape.js



FROM python:3.10-slim AS hosting

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY server.py ./

COPY --from=scraper /app/scraped_data.json ./scraped_data.json

EXPOSE 5000

CMD ["python", "server.py"]
