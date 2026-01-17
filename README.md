# Payment Gateway – Async Architecture

A simplified asynchronous payment gateway system with webhook handling, retries, dashboard, and checkout SDK.

---

## Tech Stack

- Backend API: Node.js + Express  
- Worker: Node.js + Bull  
- Database: PostgreSQL  
- Queue: Redis  
- Dashboard: React  
- Checkout SDK: Vanilla JS + Webpack  
- Containerization: Docker + Docker Compose  

---

## Architecture Overview

- API handles payment & refund creation.  
- Worker processes async jobs (payment simulation, webhooks).  
- Webhooks support retries with exponential backoff.  
- Dashboard provides webhook configuration, logs, retries, and API docs.  
- Checkout SDK provides embeddable payment UI.  

---

## Ports Used

| Service                  | Port |
|---------------------------|------|
| API                       | 8000 |
| Dashboard                 | 3000 |
| Checkout SDK              | 3001 |
| PostgreSQL                | 5432 |
| Redis                     | 6379 |
| Webhook Test Server (local)| 4000 |

---

## Running the Project

```bash
docker-compose up -d --build
```

Verify:

```bash
docker ps
```

---

## API Health Check

```bash
curl http://localhost:8000/health
```

Expected:

```json
{ "status": "ok" }
```

---

## Create Payment

```bash
curl -X POST http://localhost:8000/api/v1/payments \
-H "Content-Type: application/json" \
-H "Idempotency-Key: key_test_123" \
-d '{
  "amount": 50000,
  "currency": "INR"
}'
```

---

## Create Refund

```bash
curl -X POST http://localhost:8000/api/v1/refunds \
-H "Content-Type: application/json" \
-d '{
  "paymentId": "<SUCCESS_PAYMENT_ID>",
  "amount": 10000
}'
```

---

## Webhooks

### List Logs

```bash
curl http://localhost:8000/api/v1/webhooks/logs
```

### Retry Webhook

```bash
curl -X POST http://localhost:8000/api/v1/webhooks/<WEBHOOK_ID>/retry
```

---

## Dashboard

Open:

```
http://localhost:3000
```

Features:

- Webhook URL & secret configuration  
- Webhook logs  
- Retry failed webhooks  
- API documentation  
- SDK integration guide  

---

## Checkout SDK

Load SDK:

```html
<script src="http://localhost:3001/checkout.js"></script>
<script>
  const checkout = new PaymentGateway({
    key: "key_test_abc123",
    orderId: "order_xyz",
    onSuccess: (res) => console.log(res),
    onFailure: (err) => console.error(err)
  });

  checkout.open();
</script>
```

---

## Webhook Signature Verification

```js
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex') === signature;
}
```

---
## Architecture Diagram

      +------------------+
      |    Frontend      |
      |  Checkout Page   |
      +--------+---------+
               |
               v
      +--------+---------+
      |      API Server  |
      |  Node.js / Express
      +--------+---------+
               |
        Push job to queue
               |
               v
      +--------+---------+
      |      Job Queue    |   <--- Redis + Bull
      +--------+---------+
               |
               v
      +--------+---------+
      |     Worker        |
      | Payment Processor |
      +--------+---------+
       |            |
       v            v
+------+----+   +---+---------+
| Database  |   | Webhook     |
| PostgreSQL|   | Delivery    |
+-----------+   +-------------+
       ^             |
       |             v
       +----- Merchant / Client Endpoint


---

## Notes.  
- All services start using `docker-compose up -d`.  

---
