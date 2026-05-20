COMPOSE_DEV = docker-compose-dev.yml
COMPOSE_PROD = docker-compose.yml

.PHONY: start-dev build-dev start-prod build-prod stop clean help

start-dev: 
	@echo "Iniciando ambiente de DESENVOLVIMENTO..."
	docker compose -f $(COMPOSE_DEV) up -d

build-dev: 
	@echo "Construindo e iniciando ambiente de DESENVOLVIMENTO..."
	docker compose -f $(COMPOSE_DEV) up -d --build

start-prod:
	@echo "Iniciando ambiente de PRODUÇÃO..."
	docker compose -f $(COMPOSE_PROD) up -d

build-prod: 
	@echo "Construindo e iniciando ambiente de PRODUÇÃO..."
	docker compose -f $(COMPOSE_PROD) up -d --build

stop: 
	@echo "Parando containers ativos..."
	@if [ -f $(COMPOSE_DEV) ]; then docker compose -f $(COMPOSE_DEV) down; fi
	@if [ -f $(COMPOSE_PROD) ]; then docker compose -f $(COMPOSE_PROD) down; fi

.DEFAULT_GOAL := help