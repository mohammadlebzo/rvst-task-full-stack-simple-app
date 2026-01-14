# RVST Task – Full Stack Simple App

## Note:
I did not implement an API Gateway here as it was not requested. In a real situation it would be needed so that the front will not be directly hitting the microservices.
There are many things that can be done better here, but I'm keeping a simple scope for this project. (I did add some little things though :)

## Stack
Monorepo for Simplicity as it is a small project, no need for Polyrepo.
- Backend: NestJS (product-service on 3001, order-service on 3002), TypeORM, SQLite (dev), Swagger docs at `/api`
- Frontend: Next.js admin app on 3000, React 19, TanStack Query, axios, Tailwind, react-hot-toast

## Local Development

### Option A: Docker Compose (recommended)
```bash
docker-compose up --build
# frontend: http://localhost:3000
# product service: http://localhost:3001
# order service: http://localhost:3002
```

### Option B: Manual (no containers)
Prereqs: Node.js 20+

Install deps once (from repo root):
```bash
npm install
```

Run product-service (port 3001):
```bash
cd product-service
npm run start:dev
```

Run order-service (port 3002):
```bash
cd order-service
npm run start:dev
```

Run admin-frontend (port 3000):
```bash
cd admin-frontend
npm run dev
```

## API Usage

### Products (http://localhost:3001)
- `GET /products` — paginated list. Query: `page` (default 1), `limit` (default 10). Response:
```json
{
	"data": [/* Product */],
	"total": 40,
	"page": 1,
	"limit": 10,
	"totalPages": 4
}
```
- `POST /products` — create
```json
{
	"name": "Laptop Pro 15",
	"description": "High-performance laptop",
	"price": 1299.99,
	"stock": 25
}
```
- `GET /products/:id`
- `PATCH /products/:id` — update fields from create payload
- `PATCH /products/:id/reduce-stock` — body: `{ "quantity": 3 }`
- `DELETE /products/:id`

### Orders (http://localhost:3002)
- `GET /orders` — paginated list. Query: `page`, `limit`. Same response shape as products list.
- `POST /orders` — create
```json
{
	"productId": "<product-uuid>",
	"quantity": 2
}
```
- `GET /orders/:id`

### Health
- `GET /health` on each service returns `status`, `service`, `version`, `uptime`, `timestamp`, `database.connected`.

### Error Format
All errors use a consistent shape from the global exception filter:
```json
{
	"statusCode": 400,
	"message": ["price: must not be less than 0"],
	"timestamp": "2026-01-14T10:00:00.000Z",
	"path": "/products"
}
```
Network failures or service-down scenarios surface as axios errors; the frontend shows inline messages and toasts.

## Frontend Notes
- Runs at http://localhost:3000
- Uses react-hot-toast for success/error toasts and inline error panels for forms/lists
- Pagination UI supports Previous/Next (10 items per page)
