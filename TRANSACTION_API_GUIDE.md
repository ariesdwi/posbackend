# Transaction API Guide

This guide provides the request and response structures for the Transaction endpoints, specifically useful for building the Admin Transaction page.

---

## 1. Get All Transactions (Filtered)

**Endpoint:** `GET /transactions`  
**Description:** Retrieve a list of transactions with optional filters. Useful for listing all sales on the admin dashboard.

### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `startDate` | string | No | Filter by starting date (ISO format, e.g., `2026-01-01`) |
| `endDate` | string | No | Filter by ending date (ISO format, e.g., `2026-01-31`) |
| `status` | string | No | Filter by status (`PENDING`, `COMPLETED`, `CANCELLED`) |
| `userId` | string | No | Filter by the cashier who created the transaction |
| `tableNumber` | string | No | Filter by table number |

### Response (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-string",
      "transactionNumber": "TRX-20260126-110400-A1B2",
      "tableNumber": "Table 5",
      "totalAmount": "150000.00",
      "paymentMethod": "CASH",
      "paymentAmount": "200000.00",
      "changeAmount": "50000.00",
      "status": "COMPLETED",
      "notes": "Fast service",
      "createdAt": "2026-01-26T11:04:00.000Z",
      "items": [
        {
          "id": "item-uuid",
          "productName": "Nasi Goreng Special",
          "quantity": 2,
          "price": "50000.00",
          "subtotal": "100000.00",
          "product": { "id": "p-uuid", "name": "Nasi Goreng Special" }
        }
      ],
      "user": {
        "id": "u-uuid",
        "name": "Kasir Satu",
        "email": "kasir@pos.com"
      }
    }
  ]
}
```

---

## 2. Update Transaction Status (Admin Only)

**Endpoint:** `PATCH /transactions/:id/status`  
**Description:** Manually update the status of a transaction. Restricted to `BUSINESS_OWNER`.

### Request Body
```json
{
  "status": "COMPLETED" 
}
```
*Possible Statuses:* `PENDING`, `COMPLETED`, `CANCELLED`

### Response (200 OK)
Returns the updated transaction object (same structure as Get By ID).

---

## 3. Delete Transaction (Admin Only)

**Endpoint:** `DELETE /transactions/:id`  
**Description:** Permanually delete a transaction. Restricted to `BUSINESS_OWNER`.

### Response (200 OK)
```json
{
  "success": true,
  "message": "Transaction TRX-XXXX deleted successfully"
}
```

---

## 4. Get Transaction Details

**Endpoint:** `GET /transactions/:id`  
**Description:** Get full details of a single transaction by its ID.

### Response (200 OK)
Similar to the item structure in the "Get All" list, providing full itemization and history.

---

## Common Models

### Payment Method (`paymentMethod`)
- `CASH`
- `DEBIT`
- `CREDIT`
- `QRIS`

### Transaction Status (`status`)
- `PENDING`: Order created, payment not yet received.
- `COMPLETED`: Payment successful and stock deducted.
- `CANCELLED`: Order voided.
