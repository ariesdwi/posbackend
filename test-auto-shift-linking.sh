#!/bin/bash

echo "🧪 TEST: Auto Shift Linking"
echo "================================"
echo ""

# Login
echo "📝 Step 1: Login..."
LOGIN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ipeh@bebekfara.com","password":"ipeh123"}')

TOKEN=$(echo "$LOGIN" | jq -r '.data.accessToken')
USER_NAME=$(echo "$LOGIN" | jq -r '.data.user.name')
echo "✅ Logged in as: $USER_NAME"
echo ""

# Check/Start shift
echo "📊 Step 2: Check current shift..."
CURRENT=$(curl -s -X GET "http://localhost:3000/shifts/current" \
  -H "Authorization: Bearer $TOKEN")

HAS_SHIFT=$(echo "$CURRENT" | jq -r '.data.hasOpenShift')

if [ "$HAS_SHIFT" = "true" ]; then
  SHIFT_ID=$(echo "$CURRENT" | jq -r '.data.shift.shiftId')
  echo "✅ Active shift: $SHIFT_ID"
else
  echo "Starting new shift..."
  START=$(curl -s -X POST http://localhost:3000/shifts/start \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"initialCash": 500000}')
  
  SHIFT_ID=$(echo "$START" | jq -r '.data.shiftId')
  echo "✅ New shift started: $SHIFT_ID"
fi
echo ""

# Get real product
echo "🔍 Getting real product..."
PRODUCTS=$(curl -s -X GET "http://localhost:3000/menu?limit=1" \
  -H "Authorization: Bearer $TOKEN")
PRODUCT_ID=$(echo "$PRODUCTS" | jq -r '.data[0].id')
PRODUCT_NAME=$(echo "$PRODUCTS" | jq -r '.data[0].name')
PRODUCT_PRICE=$(echo "$PRODUCTS" | jq -r '.data[0].price')
echo "Using product: $PRODUCT_NAME (Rp $PRODUCT_PRICE)"
echo ""

# Create transaction
echo "💰 Step 3: Create transaction..."
TRANSACTION=$(curl -s -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"items\": [
      {\"productId\": \"$PRODUCT_ID\", \"quantity\": 2}
    ],
    \"paymentMethod\": \"CASH\",
    \"paymentAmount\": 50000,
    \"status\": \"COMPLETED\"
  }")

TRANS_ID=$(echo "$TRANSACTION" | jq -r '.data.id')
TRANS_SHIFT_ID=$(echo "$TRANSACTION" | jq -r '.data.shiftId')
TRANS_NUMBER=$(echo "$TRANSACTION" | jq -r '.data.transactionNumber')
TRANS_TOTAL=$(echo "$TRANSACTION" | jq -r '.data.totalAmount')

echo "Transaction created:"
echo "  - ID: $TRANS_ID"
echo "  - Number: $TRANS_NUMBER"
echo "  - Total: Rp $TRANS_TOTAL"
echo "  - Linked to Shift: $TRANS_SHIFT_ID"

if [ "$TRANS_SHIFT_ID" = "$SHIFT_ID" ]; then
  echo "  ✅ CORRECTLY LINKED!"
else
  echo "  ❌ NOT LINKED (expected: $SHIFT_ID, got: $TRANS_SHIFT_ID)"
fi
echo ""

# Check shift again
echo "📊 Step 4: Check shift again..."
AFTER=$(curl -s -X GET "http://localhost:3000/shifts/current" \
  -H "Authorization: Bearer $TOKEN")

TOTAL_SALES=$(echo "$AFTER" | jq -r '.data.shift.summary.totalSales')
TOTAL_TRANS=$(echo "$AFTER" | jq -r '.data.shift.summary.totalTransactions')

echo "Shift summary:"
echo "  - Total Sales: Rp $TOTAL_SALES"
echo "  - Total Transactions: $TOTAL_TRANS"

if [ "$TOTAL_TRANS" -gt 0 ]; then
  echo "  ✅ TRANSACTION APPEARS IN SHIFT!"
else
  echo "  ❌ TRANSACTION NOT IN SHIFT"
fi
echo ""

# Try X-Report
echo "📈 Step 5: Generate X-Report..."
XREPORT=$(curl -s -X GET "http://localhost:3000/shifts/x-report" \
  -H "Authorization: Bearer $TOKEN")

XREPORT_SUCCESS=$(echo "$XREPORT" | jq -r '.success')
XREPORT_TRANS=$(echo "$XREPORT" | jq -r '.data.summary.totalTransactions // 0')
XREPORT_SALES=$(echo "$XREPORT" | jq -r '.data.summary.totalSales // 0')
XREPORT_NUMBER=$(echo "$XREPORT" | jq -r '.data.reportNumber // "N/A"')

if [ "$XREPORT_SUCCESS" = "true" ]; then
  echo "✅ X-Report generated!"
  echo "  - Report Number: $XREPORT_NUMBER"
  echo "  - Total Transactions: $XREPORT_TRANS"
  echo "  - Total Sales: Rp $XREPORT_SALES"
else
  echo "❌ X-Report failed"
  echo "$XREPORT" | jq '.message'
fi

echo ""
echo "================================"
echo "🎯 TEST COMPLETE"
