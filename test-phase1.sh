#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWtjN2xmamMwMDAzNHlrdDgybGFlcTVmIiwiZW1haWwiOiJrYXNpckBrZWRhaWtpdGEuY29tIiwicm9sZSI6IktBU0lSIiwiYnVzaW5lc3NJZCI6ImNta2M3bGVqcjAwMDA0eWt0cW41a2owNjQiLCJzZXNzaW9uVG9rZW4iOiI0OTUwNDJmZDQwYTc0M2FmYWNjYzI2YmMzZjVhZTZiNzYwMGU4NzlmOTkyODQ3ODFjMzNlNjA5YzYxYjkwYjEwIiwiaWF0IjoxNzg5Mjg1MTk1LCJleHAiOjE3ODk4ODk5OTV9.b21m6O3bnmufbTjiM5D0gciDSaNSan4FIzd3o6wPcus"

echo "========== PHASE 1 TESTING =========="
echo ""

# Get current shift ID
SHIFT_ID=$(curl -s -X GET "http://localhost:3000/shifts/current" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data.shift.shiftId')
echo "Current Shift ID: $SHIFT_ID"
echo ""

# Test 1: X-Report
echo "========== TEST 1: X-REPORT =========="
curl -s -X GET "http://localhost:3000/shifts/x-report" \
  -H "Authorization: Bearer $TOKEN" | jq '{
    success,
    reportType: .data.reportType,
    reportNumber: .data.reportNumber,
    shift: .data.shift,
    summary: .data.summary,
    cashReconciliation: .data.cashReconciliation,
    voidSummary: .data.voidSummary
  }'
echo ""

# Test 2: Pre-Close (with correct DTO)
echo "========== TEST 2: PRE-CLOSE =========="
curl -s -X POST "http://localhost:3000/shifts/pre-close" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "finalCash": 570000,
    "edcSettlement": 0,
    "qrisSettlement": 30000,
    "notes": "Test pre-close shift"
  }' | jq '{
    success,
    statusCode,
    message,
    shiftId: .data.shiftId,
    status: .data.status,
    reconciliation: .data.reconciliation,
    warnings: .data.warnings
  }'
echo ""

# Test 3: Z-Report
echo "========== TEST 3: Z-REPORT =========="
curl -s -X GET "http://localhost:3000/shifts/$SHIFT_ID/z-report" \
  -H "Authorization: Bearer $TOKEN" | jq '{
    success,
    reportType: .data.reportType,
    reportNumber: .data.reportNumber,
    shift: .data.shift,
    summary: .data.summary,
    cashReconciliation: .data.cashReconciliation,
    voidSummary: .data.voidSummary
  }'
echo ""

echo "========== PHASE 1 TESTING COMPLETE =========="
