#!/bin/bash

echo "🦆 BEBEK FARA - X-REPORT TESTING"
echo "================================"
echo ""

# Step 1: Login
echo "📝 Step 1: Login as admin@bebekfara.com..."
LOGIN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bebekfara.com","password":"bebekfara"}')

SUCCESS=$(echo "$LOGIN" | jq -r '.success')

if [ "$SUCCESS" != "true" ]; then
  echo "❌ Login failed!"
  echo "$LOGIN" | jq .
  exit 1
fi

TOKEN=$(echo "$LOGIN" | jq -r '.data.accessToken')
USER_NAME=$(echo "$LOGIN" | jq -r '.data.user.name')
BUSINESS_ID=$(echo "$LOGIN" | jq -r '.data.user.businessId')

echo "✅ Login success!"
echo "   User: $USER_NAME"
echo "   Business ID: $BUSINESS_ID"
echo ""

# Step 2: Check current shift
echo "📊 Step 2: Check current shift..."
CURRENT=$(curl -s -X GET "http://localhost:3000/shifts/current" \
  -H "Authorization: Bearer $TOKEN")

HAS_SHIFT=$(echo "$CURRENT" | jq -r '.data.hasOpenShift')

if [ "$HAS_SHIFT" = "true" ]; then
  SHIFT_ID=$(echo "$CURRENT" | jq -r '.data.shift.shiftId')
  echo "✅ Active shift found: $SHIFT_ID"
else
  echo "⚠️  No active shift. Starting new shift..."
  
  # Start shift
  START=$(curl -s -X POST http://localhost:3000/shifts/start \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"initialCash": 500000}')
  
  SHIFT_ID=$(echo "$START" | jq -r '.data.shiftId')
  echo "✅ New shift started: $SHIFT_ID"
fi

echo ""

# Step 3: Try X-Report
echo "📈 Step 3: Generate X-Report..."
XREPORT=$(curl -s -X GET "http://localhost:3000/shifts/x-report" \
  -H "Authorization: Bearer $TOKEN")

echo "$XREPORT" | jq . || echo "$XREPORT"

XREPORT_SUCCESS=$(echo "$XREPORT" | jq -r '.success' 2>/dev/null)

if [ "$XREPORT_SUCCESS" = "true" ]; then
  echo "✅ X-Report generated successfully!"
  echo ""
  echo "$XREPORT" | jq '{
    reportNumber: .data.reportNumber,
    kasirName: .data.shift.kasirName,
    totalSales: .data.summary.totalSales,
    totalTransactions: .data.summary.totalTransactions
  }'
else
  echo "❌ X-Report failed!"
  echo ""
  echo "$XREPORT" | jq '{
    success,
    statusCode,
    message,
    error
  }'
fi

echo ""
echo "================================"
