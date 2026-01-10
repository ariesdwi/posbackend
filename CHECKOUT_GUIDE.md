# Checkout Transaction from Pending - Complete Guide

## Overview
This guide shows you how to checkout a pending transaction in the POS system.

## Checkout Flow

### Step 1: Get Pending Transactions
First, retrieve the list of pending transactions to find the one you want to checkout.

**Endpoint:** `GET /transactions?status=PENDING`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/transactions?status=PENDING" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmk69gio4004udsktqxxxf2me",
      "transactionNumber": "TRX-20260109-941124-PENDING-0005",
      "totalAmount": "10000",
      "status": "PENDING",
      "tableNumber": "Table 5",
      "items": [
        {
          "productName": "Jeruk Hangat",
          "quantity": 2,
          "price": "5000",
          "subtotal": "10000"
        }
      ],
      "user": {
        "id": "cmk4xf8in00015iktb2odelow",
        "name": "Kasir User",
        "email": "kasir@pos.com"
      }
    }
  ]
}
```

### Step 2: Checkout the Transaction
Use the transaction ID to checkout and finalize payment.

**Endpoint:** `POST /transactions/:id/checkout`

**Request Body Format:**
```json
{
  "paymentMethod": "CASH" | "CARD" | "E_WALLET" | "TRANSFER",
  "paymentAmount": number,
  "notes": "string (optional)"
}
```

**Field Descriptions:**
- `paymentMethod` (required): Payment method used
  - `CASH` - Cash payment
  - `CARD` - Credit/Debit card
  - `E_WALLET` - E-wallet (GoPay, OVO, Dana, etc.)
  - `TRANSFER` - Bank transfer
- `paymentAmount` (required): Amount paid by customer (must be >= totalAmount)
- `notes` (optional): Additional notes for the transaction

## Complete Examples

### Example 1: Checkout with Exact Payment (Cash)

**Transaction Details:**
- ID: `cmk69gio4004udsktqxxxf2me`
- Total Amount: Rp 10,000
- Payment: Rp 10,000 (exact)

**Request:**
```bash
curl -X POST "http://localhost:3000/transactions/cmk69gio4004udsktqxxxf2me/checkout" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "CASH",
    "paymentAmount": 10000
  }'
```

**Response:**
```json
{
  "id": "cmk69gio4004udsktqxxxf2me",
  "transactionNumber": "TRX-20260109-941124-PENDING-0005",
  "totalAmount": "10000",
  "paymentMethod": "CASH",
  "paymentAmount": "10000",
  "changeAmount": "0",
  "status": "COMPLETED",
  "tableNumber": "Table 5",
  "items": [...],
  "user": {...}
}
```

### Example 2: Checkout with Overpayment (Cash with Change)

**Transaction Details:**
- ID: `cmk69gio4004udsktqxxxf2me`
- Total Amount: Rp 10,000
- Payment: Rp 20,000
- Change: Rp 10,000

**Request:**
```bash
curl -X POST "http://localhost:3000/transactions/cmk69gio4004udsktqxxxf2me/checkout" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "CASH",
    "paymentAmount": 20000,
    "notes": "Customer paid with Rp 20,000 bill"
  }'
```

**Response:**
```json
{
  "id": "cmk69gio4004udsktqxxxf2me",
  "transactionNumber": "TRX-20260109-941124-PENDING-0005",
  "totalAmount": "10000",
  "paymentMethod": "CASH",
  "paymentAmount": "20000",
  "changeAmount": "10000",
  "status": "COMPLETED",
  "notes": "Customer paid with Rp 20,000 bill",
  "tableNumber": "Table 5"
}
```

### Example 3: Checkout with E-Wallet

**Request:**
```bash
curl -X POST "http://localhost:3000/transactions/TRANSACTION_ID/checkout" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "E_WALLET",
    "paymentAmount": 10000,
    "notes": "Paid via GoPay"
  }'
```

### Example 4: Checkout with Card

**Request:**
```bash
curl -X POST "http://localhost:3000/transactions/TRANSACTION_ID/checkout" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "CARD",
    "paymentAmount": 10000,
    "notes": "Visa ending in 1234"
  }'
```

### Example 5: Checkout with Bank Transfer

**Request:**
```bash
curl -X POST "http://localhost:3000/transactions/TRANSACTION_ID/checkout" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "TRANSFER",
    "paymentAmount": 10000,
    "notes": "BCA Transfer"
  }'
```

## Frontend Integration Example (JavaScript/TypeScript)

### React/Next.js Example

```typescript
interface CheckoutData {
  paymentMethod: 'CASH' | 'CARD' | 'E_WALLET' | 'TRANSFER';
  paymentAmount: number;
  notes?: string;
}

async function checkoutTransaction(
  transactionId: string,
  checkoutData: CheckoutData,
  token: string
) {
  const response = await fetch(
    `http://localhost:3000/transactions/${transactionId}/checkout`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    }
  );

  if (!response.ok) {
    throw new Error('Checkout failed');
  }

  return await response.json();
}

// Usage
const result = await checkoutTransaction(
  'cmk69gio4004udsktqxxxf2me',
  {
    paymentMethod: 'CASH',
    paymentAmount: 20000,
    notes: 'Customer paid with Rp 20,000'
  },
  userToken
);

console.log(`Change: Rp ${result.changeAmount}`);
```

### Flutter/Dart Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<Map<String, dynamic>> checkoutTransaction({
  required String transactionId,
  required String paymentMethod,
  required int paymentAmount,
  String? notes,
  required String token,
}) async {
  final response = await http.post(
    Uri.parse('http://localhost:3000/transactions/$transactionId/checkout'),
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'paymentMethod': paymentMethod,
      'paymentAmount': paymentAmount,
      if (notes != null) 'notes': notes,
    }),
  );

  if (response.statusCode == 200 || response.statusCode == 201) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Failed to checkout transaction');
  }
}

// Usage
final result = await checkoutTransaction(
  transactionId: 'cmk69gio4004udsktqxxxf2me',
  paymentMethod: 'CASH',
  paymentAmount: 20000,
  notes: 'Customer paid with Rp 20,000',
  token: userToken,
);

print('Change: Rp ${result['changeAmount']}');
```

## Validation Rules

### ✅ Valid Checkout
- `paymentAmount` >= `totalAmount`
- Transaction status must be `PENDING`
- Valid payment method (CASH, CARD, E_WALLET, TRANSFER)

### ❌ Invalid Checkout (Will Return Error)

**Insufficient Payment:**
```json
{
  "paymentMethod": "CASH",
  "paymentAmount": 5000  // Error: Total is 10,000
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": "Insufficient payment. Total: 10000, Provided: 5000"
}
```

**Already Completed Transaction:**
```json
{
  "statusCode": 400,
  "message": "Transaction is already completed or cancelled"
}
```

## Testing with Postman

1. **Import the collection:** Use the `POS_Backend_API.postman_collection.json` file
2. **Set environment variables:**
   - `baseUrl`: `http://localhost:3000`
   - `token`: Your JWT token from login
3. **Find the "Checkout Transaction" request**
4. **Update the transaction ID in the URL**
5. **Modify the request body with your payment details**
6. **Send the request**

## Quick Test Script

Here's a complete test script you can run:

```bash
#!/bin/bash

# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "kasir@pos.com", "password": "kasir123"}' \
  | jq -r '.data.accessToken')

echo "Token: $TOKEN"

# 2. Get pending transactions
PENDING=$(curl -s -X GET "http://localhost:3000/transactions?status=PENDING" \
  -H "Authorization: Bearer $TOKEN")

echo "Pending Transactions:"
echo "$PENDING" | jq '.data[0] | {id, transactionNumber, totalAmount, tableNumber}'

# 3. Get the first pending transaction ID
TRANSACTION_ID=$(echo "$PENDING" | jq -r '.data[0].id')
TOTAL_AMOUNT=$(echo "$PENDING" | jq -r '.data[0].totalAmount')

echo ""
echo "Checking out transaction: $TRANSACTION_ID"
echo "Total Amount: Rp $TOTAL_AMOUNT"

# 4. Checkout with overpayment
PAYMENT_AMOUNT=$((TOTAL_AMOUNT + 10000))

RESULT=$(curl -s -X POST "http://localhost:3000/transactions/$TRANSACTION_ID/checkout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"paymentMethod\": \"CASH\",
    \"paymentAmount\": $PAYMENT_AMOUNT,
    \"notes\": \"Test checkout\"
  }")

echo ""
echo "Checkout Result:"
echo "$RESULT" | jq '{transactionNumber, status, totalAmount, paymentAmount, changeAmount}'
```

## Summary

**Checkout Endpoint:** `POST /transactions/:id/checkout`

**Required Fields:**
- `paymentMethod`: CASH | CARD | E_WALLET | TRANSFER
- `paymentAmount`: number (must be >= totalAmount)

**Optional Fields:**
- `notes`: string

**Response:**
- Updated transaction with status `COMPLETED`
- Includes `changeAmount` (paymentAmount - totalAmount)
