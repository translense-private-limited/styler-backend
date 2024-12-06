# Default target (runs the stack)
up:
	docker-compose -f stack.yaml up --build -d

# Stop and remove containers
down:
	docker-compose -f stack.yaml down

# Restart the stack
restart:
	docker-compose -f stack.yaml down
	docker-compose -f stack.yaml up --build -d

# Remove containers, images, and volumes
clean:
	docker-compose -f stack.yaml down --volumes --rmi all

# Kill processes running on specific ports
kill-port:
	@lsof -t -i:4000 -i:4001 -i:4002 | xargs -r kill -9
stage: 
	docker-compose -f stack.yaml down --volumes --rmi all
	docker-compose -f stack.yaml up --build -d
	npm run start
debug:
	docker-compose -f stack.yaml up -d
	npm run start:debug
dev:
	docker-compose -f stack.yaml up -d
	npm run start:dev




