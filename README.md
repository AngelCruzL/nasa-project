# NASA Project

[![NASA Project CI](https://github.com/AngelCruzL/nasa-project/actions/workflows/node.yml/badge.svg)](https://github.com/AngelCruzL/nasa-project/actions/workflows/node.yml)

This is a mono repo project based on NASA's dashboard with the launches information from 2006 to current date.

## Features

- Get all planets registered in the SpaceX API
- Get all launches registered in the SpaceX API
- Populate the project's database with the planets and launches from the SpaceX API
- Get all launches from the project's database
- Creates new launches in the project's database

## Technologies

- React v17
- MongoDB
- Node
- Express
- GH Actions
- Docker
- AWS

## What I learned

- How to create a mono repo project
- How to create a CI/CD pipeline with GitHub Actions
- How to create a Docker image (including the support for multi-stage builds and Mac M1 processors)
- How to deploy a Docker image to Docker Hub
- How to deploy a Docker image to AWS EC2 Instance

## Requirements

- [Node](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)

## Setup

1. Clone the repo

    ```sh
    git clone git@github.com:AngelCruzL/nasa-project.git
    ```

2. Create an `.env` file with the same variables as `.env.example` file, this needs to be inside the server directory.

3. Install NPM packages

    ```sh
    npm install
    ```

Now you need decide if you want to run the project with Node or Docker approach. If it's the first one, you need to execute the following command:

 ```sh
 npm run dev
 ```

If you want to run the project with Docker, you need to execute the following command:

 ```sh
 docker-compose up
 ```

Or you can download the Docker image from Docker Hub:

```sh
docker pull angelcruzl/nasa-project
```

And then run the image:

```sh
docker run --restart=always -p 8000:8000 \
-e MONGO_URL="your-database-connection-uri" \
--platform linux/amd64 \
angelcruzl/nasa-project
```

The project will be running on [http://localhost:8000](http://localhost:8000)

## Build the image

If you want to modify the project and build the image, you need to execute the following command:

```sh
docker build . -t <your-docker-username>/<your-docker-custom-image-name> --platform linux/amd64
```

It's important to specify the platform because the Docker image is multi-arch, so it can be run on Mac M1 processors.

## Deployment

- [Docker Hub](https://hub.docker.com/repository/docker/angelcruzl/nasa-project)
- [AWS EC2 Instance](https://nasa-project.angelcruzl.dev/)
