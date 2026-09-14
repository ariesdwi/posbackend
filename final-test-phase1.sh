#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWtjN2xmamMwMDAzNHlrdDgybGFlcTVmIiwiZW1haWwiOiJrYXNpckBrZWRhaWtpdGEuY29tIiwicm9sZSI6IktBU0lSIiwiYnVzaW5lc3NJZCI6ImNta2M3bGVqcjAwMDA0eWt0cW41a2owNjQiLCJzZXNzaW9uVG9rZW4iOiI0OTUwNDJmZDQwYTc0M2FmYWNjYzI2YmMzZjVhZTZiNzYwMGU4NzlmOTkyODQ3ODFjMzNlNjA5YzYxYjkwYjEwIiwiaWF0IjoxNzg5Mjg1MTk1LCJleHAiOjE3ODk4ODk5OTV9.b21m6O3bnmufbTjiM5D0gciDSaNSan4FIzd3o6wPcus"

echo "========== FINAL PHASE 1 TEST =========="
echo ""

# Create sample transactions
echo "Creating sample transactions..."
TRANS_1_ID=$(curl -s -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"cml7wauqy000004jrimd12cmw","quantity":5}],"paymentMethod":"CASH","paymentAmount":50000,"status":"COMPLETED"}' \
  | jq -r '.data.id')
echo "Transaction 1 (CASH 50k): $TRANS_1_ID"

TRANS_2_ID=$(curl -s -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"cml7wauqy000004jrimd12cmw","quantity":3}],"paymentMethod":"QRIS","paymentAmount":30000,"status":"COMPLETED"}' \
  | jq -r '.data.id')
echo "Transaction 2 (QRIS 30k): $TRANS_2_ID"

TRANS_3_ID=$(curl -s -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"cml7wauqy000004jrimd12cmw","quantity":2}],"paymentMethod":"CASH","paymentAmount":20000,"status":"COMPLETED"}' \
  | jq -r '.data.id')
echo "Transaction 3 (CASH 20k - will void): $TRANS_3_ID"
echo ""

# Void transaction 3
echo "Voiding transaction 3..."
curl -s -X POST "http://localhost:3000/transactions/$TRANS_3_ID/void" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Customer cancelled","notes":"Cash refund"}' | jq '.data'
echo ""

echo "========== TEST X-REPORT =========="
curl -s -X GET "http://localhost:3000/shifts/x-report" \
  -H "Authorization: Bearer $TOKEN" | jq '{
    reportType: .data.reportType,
    reportNumber: .data.reportNumber,
    kasirName: .data.shift.kasirName,
    summary: .data.summary,
    cash: .data.paymentMethodBreakdown.cash,
    qris: .data.paymentMethodBreakdown.qris,
    voidSummary: .data.voidSummary
  }'
echo ""

echo "========== ALL TESTS COMPLETE =========="
