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
	docker compose -f stack.yaml up -d
	npm run start:debug
dev:
	docker compose -f stack.yaml up -d
	npm run start:dev
mysql: 
	docker exec -it styler-mysql mysql -u user -p
# Start all frontend applications
start-frontend:
	@lsof -t -i:5000 -i:5001 -i:5002 -i:5003 | xargs -r kill -9
	@echo "Starting Styler Customer App..."
	@cd ../styler-customer && git checkout main && git pull && npm install && npm run dev &
	@echo "Starting Styler Web Client..."
	@cd ../styler-client && git checkout main && git pull && npm install && npm run dev &
	@echo "Starting Styler Admin App..."
	@cd ../styler-admin && git checkout main && git pull && npm install && npm run dev &




