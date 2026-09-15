#!/bin/bash

echo "🔍 Checking password for ipeh@bebekfara.com"
echo ""

# Array of common passwords to try
passwords=("ipeh" "ipeh123" "bebekfara" "password" "password123" "kasir123" "12345678" "Ipeh123" "Bebekfara123")

for pass in "${passwords[@]}"; do
  printf "Testing: %-20s " "$pass"
  
  response=$(curl -s -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"ipeh@bebekfara.com\",\"password\":\"$pass\"}")
  
  success=$(echo "$response" | jq -r '.success' 2>/dev/null)
  
  if [ "$success" = "true" ]; then
    echo "✅ CORRECT PASSWORD!"
    echo ""
    echo "═══════════════════════════════════"
    echo "📧 Email: ipeh@bebekfara.com"
    echo "🔑 Password: $pass"
    echo "═══════════════════════════════════"
    echo ""
    echo "User Details:"
    echo "$response" | jq '.data.user | {name, role, businessId}'
    exit 0
  else
    echo "❌"
  fi
done

echo ""
echo "⚠️  None of the common passwords worked."
echo "Password might need to be reset or checked in database."
