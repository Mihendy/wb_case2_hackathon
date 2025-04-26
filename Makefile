
DOCKER_COMPOSE = docker compose
COMPOSE_FILE ?= docker-compose.yml
BACKEND = backend
MANAGE = $(DOCKER_COMPOSE) exec $(BACKEND) python manage.py
D_MANAGE = $(DOCKER_COMPOSE) exec -d $(BACKEND) python manage.py

migrate:
	$(MANAGE) migrate $(if $m, api $m,)

makemigrations:
	$(MANAGE) makemigrations

createsuperuser:
	$(MANAGE) createsuperuser

collectstatic:
	$(MANAGE) collectstatic --no-input

squashmigrations:
	$(MANAGE) squashmigrations $(app) $(migration)

unsquash:
	$(MANAGE) migrate $(app) $(migration) --fake

up:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d

down:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down

build:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d --build

push:
	docker push $(BACKEND_IMAGE)

pull:
	docker pull $(BACKEND_IMAGE)

command:
	$(MANAGE) ${c}

shell:
	$(MANAGE) shell

piplock:
	pipenv install
	sudo chown -R ${USER} Pipfile.lock

lint:
	isort .
	flake8 --config setup.cfg

check_lint:
	$(DOCKER_COMPOSE) exec $(BACKEND) isort --check --diff ../.
	$(DOCKER_COMPOSE) exec $(BACKEND) flake8 --config ../setup.cfg

check_lint_local:
	isort --check --diff .
	flake8 --config setup.cfg
