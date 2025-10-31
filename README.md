# 🏛️ Neighbourhood Library System

A full-stack library management system with gRPC backend, Node.js HTTP gateway, React frontend, and PostgreSQL database — all containerized via Docker.

---

## ⚙️ Services Overview
| Service | Description | Port |
|----------|--------------|------|
| **db** | PostgreSQL database initialized with `db/init.sql` | 5432 |
| **grpc-server** | Python gRPC service implementing core logic | 50051 |
| **node-gateway** | Node.js REST API gateway to gRPC | 3001 |
| **frontend** | React + Nginx web app | 3000 |

---

## 🚀 Quick Start (Docker)

### 1️⃣ Build and run all services
```bash
docker compose up --build -d
```

### 2️⃣ Access
- **Frontend:** http://localhost:3000  
- **HTTP API (Gateway):** http://localhost:3001  
- **gRPC Server:** localhost:50051  
- **Database:** localhost:5432 (user: `library_user`, pass: `library_pass`)

---

## 🗃️ Database Setup
- Schema auto-initialized from `db/init.sql` when Postgres starts (via Docker volume).  
- Manual setup (optional):
  ```bash
  psql -h localhost -U library_user -d library_db -f db/init.sql
  ```

---

## 🧩 Protobuf Compilation

### For Python (`grpc-server`)
```bash
cd backend/grpc_server
python -m pip install -r requirements.txt
mkdir -p generated
python -m grpc_tools.protoc -I protos   --python_out=generated   --grpc_python_out=generated   protos/library.proto
touch generated/__init__.py
```

*(Node.js uses `@grpc/proto-loader` at runtime — no build step needed.)*

---

## 🐍 Run Python gRPC Server Locally
```bash
cd backend/grpc_server
python -m venv .venv
source .venv/bin/activate   # (on Windows: .venv\Scripts\activate)
pip install -r requirements.txt
export DATABASE_URL=postgresql://library_user:library_pass@localhost:5432/library_db
export GRPC_PORT=50051
python -m app.server
```

---


## ✅ Running tests

Run all Python unit tests for the gRPC backend inside the Docker container for full isolation and reproducibility:

```powershell
# build and start services (only grpc-server is needed but Compose will start others)
docker compose up --build -d

# run tests inside the grpc-server container
docker compose exec grpc-server pytest tests/ -v --cov=app

# stop containers when done
docker compose down
```

What the tests cover
- Unit tests for services (books, members, borrowings)
- Validator tests
- Tests run against an in-memory SQLite database to avoid touching production data


---

## 🌐 Run Node Gateway Locally
```bash
cd backend/node_gateway
npm install
node server.js
```

---

## 💻 Run Frontend Locally
```bash
cd frontend
npm install
export REACT_APP_API_BASE_URL=http://localhost:3001
npm start
```

---

## 🔍 Key Endpoints

| HTTP Method | Endpoint | Description |
|--------------|-----------|-------------|
| GET /books | List books |
| POST /books | Add book |
| PUT /books/:id | Update book |
| DELETE /books/:id | Delete book |
| POST /borrow | Borrow book |
| GET /borrowed | List borrowed books |
| GET /members | List members |
| POST /members | Add member |
| PUT /members/:id | Update member |
| DELETE /members/:id | Delete member (blocked if books not returned) |

---


## 🧱 Folder Structure
```
.
├── backend/
│   ├── grpc_server/
│   │   ├── app/
│   │   │   ├── models.py
│   │   │   ├── database.py
│   │   │   ├── service_impl.py
│   │   │   ├── constants.py
│   │   │   ├── logging_config.py
│   │   ├── services/
│   │   │   ├── book_service.py
│   │   │   ├── member_service.py
│   │   │   ├── borrowing_service.py
│   │   ├── generated/
│   │   │   ├── library_pb2.py
│   │   │   ├── library_pb2_grpc.py
│   │   ├── protos/
│   │   │   └── library.proto
│   │   ├── tests/
│   │   │   ├── test_book_service.py
│   │   │   ├── test_member_service.py
│   │   │   ├── test_borrowing_service.py
│   │   │   ├── test_validators.py
│   │   │   └── conftest.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   ├── entrypoint.sh
│   │   └── server.py
│   └── node_gateway/
│       ├── server.js
│       ├── package.json
│       ├── Dockerfile
│       └── protos/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
├── db/
│   └── init.sql
├── docker-compose.yml
└── README.md
```

---

## 🧰 Useful Commands
```bash
docker compose logs -f grpc-server node-gateway frontend
docker compose down --volumes
docker compose build --no-cache frontend
```
