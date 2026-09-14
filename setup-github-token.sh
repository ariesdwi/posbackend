#!/bin/bash

echo "🔧 GitHub Access Token Setup"
echo ""
echo "📋 Langkah-langkah mendapatkan token:"
echo "   1. Buka: https://github.com/settings/tokens"
echo "   2. Klik 'Generate new token (classic)'"
echo "   3. Beri nama: 'POS Backend Development'"
echo "   4. Pilih scope: ✓ repo, ✓ workflow"
echo "   5. Klik 'Generate token' dan COPY token-nya"
echo ""
read -p "Paste your GitHub Personal Access Token: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
  echo "❌ Token tidak boleh kosong!"
  exit 1
fi

echo "📝 Updating git remote..."

# Remove old remote
git remote remove origin 2>/dev/null

# Add new remote with token
git remote add origin https://${TOKEN}@github.com/ariesdwi/posbackend.git

echo ""
echo "✅ Git remote updated!"
echo ""
echo "📡 Testing connection..."
git remote -v
echo ""

# Test access
echo "🔍 Testing GitHub access..."
if git ls-remote origin &> /dev/null; then
  echo "✅ Connection successful!"
else
  echo "❌ Connection failed. Please check your token."
  exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📤 Sekarang kamu bisa:"
echo "   git add ."
echo "   git commit -m 'message'"
echo "   git push -u origin main"
echo ""
