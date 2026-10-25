
.PHONY: build up down restart logs shell clean

IMAGE_NAME := greenville
CONTAINER_NAME := greenville
PORT := 3000

build:
	docker build -t $(IMAGE_NAME) .

up:
	docker run -d \
		--name $(CONTAINER_NAME) \
		--restart unless-stopped \
		-p 127.0.0.1:$(PORT):80 \
		$(IMAGE_NAME)

down:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

restart: down up

logs:
	docker logs -f $(CONTAINER_NAME)

shell:
	docker exec -it $(CONTAINER_NAME) sh

clean: down
	docker image rm $(IMAGE_NAME) || true
