# Multi-Stage Docker Build: Node.js Puppeteer Scraper with Python Flask

## 1. Project Overview

This project demonstrates a multi-stage Docker build that combines Node.js browser automation with Python-based web hosting.

The application uses **Node.js, Puppeteer, and Chromium** to automatically visit a user-provided website and extract information such as its page title, first heading, meta description, URL, and scraping timestamp.

The extracted information is stored in a JSON file. A separate Python Flask application then reads this file and makes the scraped content available through an HTTP endpoint.

Docker multi-stage builds are used to separate the scraping environment from the hosting environment, keeping unnecessary Node.js and Chromium dependencies out of the final image.

## 2. Project Objectives

- Automate website scraping using Puppeteer and Chromium.
- Accept a user-specified URL through a Docker build argument.
- Extract useful information from the target webpage.
- Store the extracted information in a JSON file.
- Serve the JSON data using a lightweight Python Flask application.
- Implement a multi-stage Docker build.
- Reduce unnecessary dependencies in the final Docker image.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js 18 | Executes the JavaScript scraper |
| Puppeteer Core | Automates browser operations |
| Chromium | Headless browser used to access websites |
| Python 3.10 | Runs the hosting application |
| Flask | Provides HTTP endpoints |
| Docker | Builds and runs the containerized application |
| JSON | Stores and transfers scraped information |

## 4. Application Architecture

The application consists of two Docker build stages.

### Stage 1: Node.js Scraper

The first stage uses the `node:18-slim` base image.

It performs the following operations:

1. Installs Chromium and the required system dependencies.
2. Installs Puppeteer Core using `package.json`.
3. Accepts the target website URL through the `SCRAPE_URL` build argument.
4. Launches Chromium in headless mode.
5. Navigates to the specified website.
6. Extracts the page title, first heading, meta description, URL, and timestamp.
7. Saves the extracted information in `scraped_data.json`.

### Stage 2: Python Hosting

The second stage uses the `python:3.10-slim` base image.

It performs the following operations:

1. Installs Flask using `requirements.txt`.
2. Copies `server.py` into the application directory.
3. Copies `scraped_data.json` from the first stage using Docker's `COPY --from` instruction.
4. Starts the Flask web server on port 5000.

The final image contains only the Python hosting application, Flask dependencies, and scraped JSON data. Node.js and Chromium are not required at runtime.

## 5. Project Structure

```text
web-scraper/
│
├── Dockerfile
│   └── Defines the Node.js and Python build stages.
│
├── scrape.js
│   └── Automates browser operations and extracts website data.
│
├── package.json
│   └── Defines Node.js dependencies.
│
├── server.py
│   └── Reads and serves the scraped JSON data.
│
├── requirements.txt
│   └── Defines Python dependencies.
│
└── README.md
    └── Project documentation.
```

The `scraped_data.json` file is generated during the Docker image build and copied into the final stage. It does not need to be created manually.

## 6. Prerequisites

Before running the project, ensure that you have:

- Docker Engine installed.
- A working internet connection.
- Access to the target website.
- A Linux environment or another operating system supporting Docker.

**Note:** Node.js, Python, Chromium, and Flask do not need to be installed directly on the host machine. Their required environments are provided by the Docker build stages.

## 7. Building the Docker Image

Clone or download the project and navigate to its directory:

```bash
cd web-scraper
```

Build the Docker image by supplying the website URL:

```bash
docker build \
  --build-arg SCRAPE_URL=https://example.com \
  -t web-scraper:1.0 .
```

Replace `https://example.com` with the website you want to scrape.

### What happens during the build?

- Docker executes the Node.js scraper stage.
- Chromium opens the supplied website.
- Puppeteer extracts the required information.
- The scraped information is saved as `scraped_data.json`.
- Docker creates the Python hosting stage.
- The JSON file is copied from the scraper stage.
- Flask and the Python application are prepared for execution.

Once the build completes, the Docker image is ready.

To verify the image:

```bash
docker images
```

## 8. Running the Docker Container

Start the application using:

```bash
docker run -d \
  --name web-scraper-container \
  -p 5000:5000 \
  web-scraper:1.0
```

### Command explanation

| Option | Description |
|---|---|
| `-d` | Runs the container in the background |
| `--name` | Assigns a name to the container |
| `-p 5000:5000` | Maps host port 5000 to container port 5000 |
| `web-scraper:1.0` | Specifies the Docker image |

## 9. Accessing the Scraped Data

After starting the container, open the following URL in a web browser:

**http://localhost:5000**

The Flask application reads `scraped_data.json` and returns the extracted information in JSON format.

### Example Response

```json
{
    "title": "Example Domain",
    "heading": "Example Domain",
    "description": null,
    "url": "https://example.com/",
    "scrapedAt": "2026-11-12T10:30:00.000Z"
}
```

The actual response depends on the website being scraped.

### Available HTTP Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Returns the scraped website information as JSON |
| `/health` | GET | Returns the application health status |

## 10. Testing the Application

### Check running containers

```bash
docker ps
```

### View application logs

```bash
docker logs web-scraper-container
```

### Test the scraped data endpoint

```bash
curl http://localhost:5000
```

### Test the health endpoint

```bash
curl http://localhost:5000/health
```

Expected health response:

```json
{
    "status": "healthy"
}
```

### Verify the final image

To verify that Node.js and Chromium are not included in the final image:

```bash
docker run --rm \
  --entrypoint sh \
  web-scraper:1.0 \
  -c 'command -v node || echo "Node.js not installed"; command -v chromium || echo "Chromium not installed"'
```

The final image should report that neither Node.js nor Chromium is installed.

## 11. Scraping a Different Website

To scrape another website, rebuild the Docker image with a different URL.

For example:

```bash
docker build \
  --build-arg SCRAPE_URL=https://www.wikipedia.org \
  -t web-scraper:1.0 .
```

Remove the previously running container:

```bash
docker rm -f web-scraper-container
```

Start the updated container:

```bash
docker run -d \
  --name web-scraper-container \
  -p 5000:5000 \
  web-scraper:1.0
```

Visit `http://localhost:5000` to view the newly scraped information.

**Important:** The URL is supplied at image build time. Changing the target website requires rebuilding the image because the scraping operation happens during the first Docker stage.

## 12. Troubleshooting

| Problem | Possible Solution |
|---|---|
| Chromium fails to launch | Verify Chromium installation and its executable path. |
| Puppeteer module not found | Check `package.json` and dependency installation. |
| Website navigation fails | Verify the URL and internet connectivity. |
| Flask module not found | Check `requirements.txt` and Python dependency installation. |
| Port 5000 is unavailable | Use another host port, such as `5001:5000`. |
| Scraped JSON file not found | Check the scraper execution and Docker `COPY --from` instruction. |
| Website blocks automated access | Test with a publicly accessible website that permits automated browsing. |

## 13. Important Implementation Notes

- Puppeteer Core is used instead of the full Puppeteer package to avoid downloading a separate bundled Chromium browser.
- Chromium is installed directly in the Node.js Docker stage.
- The `--no-sandbox` and related browser flags allow Chromium to run in the container configuration used by this project.
- Docker's multi-stage build keeps the scraper dependencies separate from the final hosting environment.
- The final container starts only the Python Flask server.
- Scraping occurs during image construction, not each time the container starts.
- The application is intended for publicly accessible websites that permit automated access.

## 14. Conclusion

This project demonstrates how different programming technologies can work together in a containerized application.

Node.js, Puppeteer, and Chromium handle automated website scraping, while Python Flask provides a simple HTTP interface for accessing the extracted information.

Using Docker multi-stage builds separates these responsibilities and avoids carrying unnecessary browser automation dependencies into the final runtime image.
