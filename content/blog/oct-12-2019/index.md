---
title: "Docker"
date: "2019-10-12T01:48:18.083Z"
description: "What the dock?"
tags: ["docker", "docker-compose", "image", "container", "amazon", "dynamodb"]
# image: coffee.png
---

Notes & Commands from my first _real_ attempt at learning Docker (...but I probably spent more time fiddling with markdown styling & css of this post)

### List Containers

<details>
  <summary>Syntax</summary>

```
docker ps [OPTIONS]
```

[ps-docs](https://docs.docker.com/engine/reference/commandline/ps/)

</details>

```bash
docker ps

# CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS              PORTS                              NAMES
# e9e1f48613d9        amazon/dynamodb-local   "java -jar DynamoDBL…"   9 seconds ago       Up 8 seconds        8000/tcp, 0.0.0.0:8000->8008/tcp   festive_lamport
```

### List Docker Images

<details>
  <summary>Syntax</summary>

```
docker images [OPTIONS] [REPOSITORY[:TAG]]
```

[images-docs](https://docs.docker.com/engine/reference/commandline/images/)

</details>

```bash
docker images

# REPOSITORY                TAG                 IMAGE ID            CREATED             SIZE
# amazon/dynamodb-local     latest              d0e7e8b4a50a        8 months ago        506MB
# node                      7.2.1-alpine        a1c188c2c5e1        2 years ago         55.3MB
```

### Pull an image or a repository from a registry

<details>
  <summary>Syntax</summary>

```
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

[pull-docs](https://docs.docker.com/engine/reference/commandline/pull/)

</details>

```bash
docker pull amazon/dynamodb-local
#           [NAME]
#           amazon/dynamodb-local
```

### Run a command in a new container

<details>
  <summary>Syntax</summary>

```
docker run [OPTIONS] IMAGE [COMMAND][arg...]
```

[run-docs](https://docs.docker.com/engine/reference/commandline/run/)

</details>

```bash
docker run -p 8000:8000 amazon/dynamodb-local
#          [Options]
#          -p Host:Container
#                       [Image]
#                       amazon/dynamodb-local
```

#### `docker run` options

| Name, shorthand    | Default | Description                                                                                                                            |
| :----------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| `--publish` , `-p` |         | Publish a container’s port(s) to the host. See [container-networking](https://docs.docker.com/config/containers/container-networking/) |
| `--detach` , `-d`  |         | Run container in background and print container ID                                                                                     |

# Docker Compose

<details>
  <summary>Notes</summary>

[compose-docs](https://docs.docker.com/compose/)

<h3>What is docker-compose?</h3>

- _"A tool for defining and running multi-container Docker applications"_
- _"You use a YAML file to configure your application’s services"_

<h3>3 step process to using docker-compose</h3>

1. Define your app’s environment with a **Dockerfile** so it can be reproduced anywhere.

2. Define the services that make up your app in `docker-compose.yml` so they can be run together in an isolated environment.

3. Run `docker-compose up` and **Compose** starts and runs your entire app.

</details>

## Usage with Django + PostgreSQL

I just started learning Django last week, so coming across this is a perfect coincidence.

[compose + django docs](https://docs.docker.com/compose/django/)

##### `Dockerfile`

```Dockerfile
FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
```

<details>
  <summary>Explanation</summary>

| Statement                                                              | Params                            | What's going on?                                                                                                                                                                                                          |
| :--------------------------------------------------------------------- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`FROM`](https://docs.docker.com/engine/reference/builder/#from)       | `python:3`                        | This Dockerfile starts with ha Python 3 parent image                                                                                                                                                                      |
| [`ENV`](https://docs.docker.com/engine/reference/builder/#env)         | `PYTHONUNBUFFERED` `1`            | Set environment variable                                                                                                                                                                                                  |
| [`RUN`](https://docs.docker.com/engine/reference/builder/#run)         | `mkdir /code`                     | Add a new directory to the image                                                                                                                                                                                          |
| [`WORKDIR`](https://docs.docker.com/engine/reference/builder/#workdir) | `/code`                           | Set working directory to `code/` for following `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD` commands                                                                                                                         |
| [`COPY`](https://docs.docker.com/engine/reference/builder/#copy)       | `requirements.txt` `/code/`       | Copy files/dirs from `<src>` to the filesystem of the container, `<dest>` <br/> <li>`src` is relative to the source of the context of the build</li> <li>`dest` is an absolute path, or a path relative to `WORKDIR`</li> |
| `RUN`                                                                  | `pip install -r requirements.txt` | Run pip install on the container                                                                                                                                                                                          |
| `COPY`                                                                 | `.` `/code/`                      | ?                                                                                                                                                                                                                         |

</details>

##### `requirements.txt`

```txt
Django>=2.0,<3.0
psycopg2>=2.7,<3.0
```

<details>
  <summary>What's this for?</summary>

This file is used by the `RUN pip install -r requirements.txt` command in the `Dockerfile`.

</details>

##### `docker-compose.yml`

```yaml
version: "3"

services:
  db:
    image: postgres
  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/code
    ports:
      - "8000:8000"
    depends_on:
      - db
```

<details open>
  <summary>Uh, what?</summary>

[Compose file reference](https://docs.docker.com/compose/compose-file/)

<h3>This describes</h3>

- the services, `db` & `web`, which make up the app.
- which Docker [images](https://docs.docker.com/compose/compose-file/#image) the services use
- how they link together
- [volumes](https://docs.docker.com/compose/compose-file/#volumes) they need mounted inside the containers.
- the ports the services expose

| Key                                                                      | Description                                                                                                                                                                                                                       |
| :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`image`](https://docs.docker.com/compose/compose-file/#image)           | Specify the image to start the container from. Can either be a repository/tag or a partial image ID.                                                                                                                              |
| [`volumes`](https://docs.docker.com/compose/compose-file/#volumes)       | Mount host paths or named volumes, specified as sub-options to a service. <br/>Here, the web service uses a volume that is defined using the old string format for mountain a volume. <br/> Uses "short syntax": `HOST:CONTAINER` |
| [`depends_on`](https://docs.docker.com/compose/compose-file/#depends_on) | Express dependency between services. `docker-compose up` starts services in "dependency order". So, `db` starts before `web`                                                                                                      |

</details>

### Create a Django Project

<details>
  <summary>Syntax</summary>

```
run [options] [-v VOLUME...] [-p PORT...] [-e KEY=VAL...] [-l KEY=VALUE...] SERVICE [COMMAND] [ARGS...]
```

[docker-compose run docs](https://docs.docker.com/compose/reference/run/)

Runs a one-time command against a service.

The following command instructs Compose to run `django-admin startproject exampleproj` in a container, using the `web` service's image and configuration.

Because the `web` image doesn't exist yet, Compose builds it from the current directory, as specified by the `build: .` line in `docker-compose.yml`

</details>

```bash
sudo docker-compose run web django-admin startproject exampleproj .
#                       [SERVICE]
#                       web
#                           [COMMAND]
#                           django-admin startproject exampleproj
#                           - "create a project called exampleproj"
#                                                                 [ARGS]
#                                                                 .
```

### Connect the database

These steps are Django specific. See [Connect the database](https://docs.docker.com/compose/django/#connect-the-database)

### Start your Django Project

<details>
  <summary>Syntax</summary>

```
docker-compose up [options] [--scale SERVICE=NUM...] [SERVICE...]
```

[docker-compose up docs](https://docs.docker.com/compose/reference/up/)

</details>

```bash
docker-compose up
```

### Stop your Django Project

<details>
  <summary>Syntax</summary>

```
docker-compose down [options]
```

[docker-compose down docs](https://docs.docker.com/compose/reference/down/)

</details>

```bash
docker-compose down
```
