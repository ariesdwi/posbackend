# Transaction Types - Bebek Fara POS System

## 📊 Overview

Sistem POS Bebek Fara memiliki **1 jenis transaksi** dengan berbagai **status** dan **payment methods**.

---

## 1. Transaction Model

### Core Transaction
**Model:** `Transaction`

```typescript
{
  id: string                    // Unique ID
  transactionNumber: string     // Format: TRX-YYYYMMDD-HHMMSS-XXXX
  userId: string                // Kasir yang membuat
  businessId: string            // Bebek Fara business
  shiftId: string | null        // Linked to shift (if any)
  
  // Amount & Payment
  totalAmount: Decimal          // Total tagihan
  paymentMethod: PaymentMethod  // Metode pembayaran
  paymentAmount: Decimal | null // Jumlah yang dibayar customer
  changeAmount: Decimal | null  // Kembalian
  
  // Status & Metadata
  status: TransactionStatus     // PENDING / COMPLETED / CANCELLED
  tableNumber: string | null    // Nomor meja (optional)
  notes: string | null          // Catatan tambahan
  
  // Phase 1: Void Tracking
  isVoid: boolean               // Apakah transaksi di-void
  voidReason: string | null     // Alasan void
  voidedAt: DateTime | null     // Kapan di-void
  voidedBy: string | null       // User ID yang void
  
  // Phase 1: Discount Tracking
  discountAmount: Decimal       // Total diskon
  discountNotes: string | null  // Catatan diskon
  
  // Timestamps
  createdAt: DateTime           // Waktu dibuat
  updatedAt: DateTime           // Waktu diupdate
  
  // Relations
  items: TransactionItem[]      // Item yang dibeli
  user: User                    // Kasir
  business: Business            // Bebek Fara
  shift: Shift | null           // Shift (if linked)
}
```

---

## 2. Transaction Status (3 Types)

### 2.1. PENDING
**Description:** Transaksi belum dibayar / masih di-hold

**Use Cases:**
- 📝 Order dine-in yang masih di meja (belum checkout)
- 🛒 Order yang sedang disiapkan
- ⏳ Split bill (sebagian item sudah dibayar)

**Characteristics:**
- ✅ Bisa di-edit (add/remove items)
- ✅ Bisa di-cancel
- ❌ Tidak masuk ke laporan penjualan
- ❌ Tidak bisa di-void (harus COMPLETED dulu)

**API Endpoints:**
```javascript
// Create PENDING transaction
POST /transactions
{
  "items": [...],
  "status": "PENDING",  // Optional, default PENDING
  "tableNumber": "Meja 5"
}

// Update PENDING transaction
PATCH /transactions/:id
{
  "items": [...],
  "notes": "Updated order"
}
```

---

### 2.2. COMPLETED
**Description:** Transaksi sudah dibayar lunas

**Use Cases:**
- ✅ Customer sudah bayar
- ✅ Transaction ready untuk laporan
- ✅ Masuk ke shift summary

**Characteristics:**
- ✅ Masuk ke laporan penjualan (X-Report, Z-Report)
- ✅ Bisa di-void (with reason)
- ✅ Final transaction
- ⚠️ Tidak bisa di-edit (kecuali admin)

**API Endpoints:**
```javascript
// Create COMPLETED transaction (direct checkout)
POST /transactions
{
  "items": [...],
  "paymentMethod": "CASH",
  "paymentAmount": 100000,
  "status": "COMPLETED"
}

// Checkout PENDING transaction
POST /transactions/:id/checkout
{
  "paymentMethod": "QRIS",
  "paymentAmount": 50000
}

// Void COMPLETED transaction (Phase 1)
POST /transactions/:id/void
{
  "reason": "Customer cancelled",
  "notes": "Refund via cash"
}
```

---

### 2.3. CANCELLED
**Description:** Transaksi dibatalkan (tidak jadi)

**Use Cases:**
- ❌ Customer batal order sebelum bayar
- ❌ Order error/salah input
- ❌ System cleanup

**Characteristics:**
- ❌ Tidak masuk laporan penjualan
- ❌ Tidak bisa di-void
- ✅ Audit trail tersimpan

**API Endpoints:**
```javascript
// Cancel transaction (Admin only)
PATCH /transactions/:id/status
{
  "status": "CANCELLED"
}
```

**Note:** CANCELLED vs VOID:
- **CANCELLED**: Dibatalkan sebelum/saat PENDING (belum bayar)
- **VOID**: Dibatalkan setelah COMPLETED (sudah bayar, butuh refund)

---

## 3. Payment Methods (7 Types)

### 3.1. CASH (Tunai)
```javascript
{
  paymentMethod: "CASH",
  paymentAmount: 100000,  // Required
  changeAmount: 10000     // Auto-calculated
}
```
**Reconciliation:** Manual count vs expected

---

### 3.2. QRIS (Scan QR)
```javascript
{
  paymentMethod: "QRIS",
  paymentAmount: 50000,
  changeAmount: 0
}
```
**Reconciliation:** QRIS settlement report

---

### 3.3. DEBIT (EDC Machine)
```javascript
{
  paymentMethod: "DEBIT",
  paymentAmount: 75000,
  changeAmount: 0
}
```
**Reconciliation:** EDC settlement report

---

### 3.4. GRABFOOD (Online Delivery)
```javascript
{
  paymentMethod: "GRABFOOD",
  paymentAmount: 45000,
  changeAmount: 0
}
```
**Reconciliation:** GrabFood dashboard

---

### 3.5. SHOPEEFOOD (Online Delivery)
```javascript
{
  paymentMethod: "SHOPEEFOOD",
  paymentAmount: 40000,
  changeAmount: 0
}
```
**Reconciliation:** ShopeeFood dashboard

---

### 3.6. GOFOOD (Online Delivery)
```javascript
{
  paymentMethod: "GOFOOD",
  paymentAmount: 55000,
  changeAmount: 0
}
```
**Reconciliation:** GoFood dashboard

---

### 3.7. OTHER (Lainnya)
```javascript
{
  paymentMethod: "OTHER",
  paymentAmount: 30000,
  changeAmount: 0,
  notes: "Transfer BCA"  // Specify di notes
}
```
**Use Cases:** Bank transfer, voucher, kredit, dll

---

## 4. Transaction Flow Diagram

```
┌─────────────────┐
│  CREATE ORDER   │
└────────┬────────┘
         │
         ▼
    ┌─────────┐
    │ PENDING │ ◄─────┐ (Can add/remove items)
    └────┬────┘       │
         │            │
         │ [Checkout] │
         │            │
         ▼            │
   ┌───────────┐     │
   │ COMPLETED │     │
   └─────┬─────┘     │
         │           │
    ┌────┴────┐      │
    │         │      │
    ▼         ▼      │
 [Keep]    [VOID]    │
          (Phase 1)  │
            │        │
            ▼        │
      ┌──────────┐   │
      │ isVoid=  │   │
      │  true    │   │
      └──────────┘   │
                     │
    [Cancel] ────────┘
    (Admin only)
         │
         ▼
   ┌───────────┐
   │ CANCELLED │
   └───────────┘
```

---

## 5. Transaction Lifecycle Examples

### Example 1: Dine-in (Normal Flow)
```javascript
// Step 1: Create pending order
POST /transactions
{
  "items": [
    {"productId": "prod-123", "quantity": 2}
  ],
  "status": "PENDING",
  "tableNumber": "Meja 3"
}
// Response: { id: "trans-001", status: "PENDING" }

// Step 2: Customer add more items
PATCH /transactions/trans-001
{
  "items": [
    {"productId": "prod-123", "quantity": 2},
    {"productId": "prod-456", "quantity": 1}  // Added
  ]
}

// Step 3: Customer pay
POST /transactions/trans-001/checkout
{
  "paymentMethod": "CASH",
  "paymentAmount": 100000
}
// Response: { status: "COMPLETED", changeAmount: 20000 }
```

---

### Example 2: Takeaway (Direct Checkout)
```javascript
// Direct checkout (skip PENDING)
POST /transactions
{
  "items": [
    {"productId": "prod-789", "quantity": 1}
  ],
  "paymentMethod": "QRIS",
  "paymentAmount": 25000,
  "status": "COMPLETED"  // Direct to COMPLETED
}
```

---

### Example 3: Order Cancelled
```javascript
// Step 1: Create pending
POST /transactions
{
  "items": [{"productId": "prod-111", "quantity": 3}],
  "status": "PENDING"
}

// Step 2: Customer cancel before payment
PATCH /transactions/trans-002/status
{
  "status": "CANCELLED"
}
```

---

### Example 4: Refund (Void)
```javascript
// Step 1: Transaction completed
POST /transactions
{
  "items": [{"productId": "prod-222", "quantity": 2}],
  "paymentMethod": "CASH",
  "paymentAmount": 50000,
  "status": "COMPLETED"
}

// Step 2: Customer complain, need refund
POST /transactions/trans-003/void
{
  "reason": "Food not good",
  "notes": "Refunded Rp 50,000 cash"
}
// Result: isVoid=true, but transaction kept for audit
```

---

## 6. Transaction in Reports

### X-Report (Mid-Shift)
```javascript
GET /shifts/x-report

// Only counts:
✅ status = COMPLETED
✅ isVoid = false
❌ status = PENDING (not counted yet)
❌ status = CANCELLED (never counted)
❌ isVoid = true (counted in void summary separately)
```

### Z-Report (End-Shift)
```javascript
GET /shifts/:shiftId/z-report

// Sales breakdown:
✅ COMPLETED transactions (not void)

// Void summary:
⚠️ COMPLETED but isVoid=true (with reasons)

// Not included:
❌ PENDING
❌ CANCELLED
```

---

## 7. Transaction Item (Products in Transaction)

```typescript
TransactionItem {
  id: string
  transactionId: string
  productId: string | null      // Bisa null jika custom item
  productName: string            // Product name snapshot
  quantity: number               // Jumlah
  price: Decimal                 // Harga per unit (snapshot)
  subtotal: Decimal              // quantity × price
  costPrice: Decimal             // Cost price (for profit calc)
}
```

**Why snapshot?**
- Product price bisa berubah di masa depan
- Transaction harus tetap akurat sesuai harga saat transaksi
- Historical data integrity

---

## 8. Business Rules

### ✅ Allowed Actions

| Status | Edit Items | Change Status | Void | Delete |
|--------|-----------|---------------|------|--------|
| PENDING | ✅ Kasir | ✅ to COMPLETED/CANCELLED | ❌ | ✅ Admin |
| COMPLETED | ❌ (Admin only) | ❌ | ✅ | ✅ Admin |
| CANCELLED | ❌ | ❌ | ❌ | ✅ Admin |

### 🔒 Validations

1. **Payment Amount**
   - Must be ≥ totalAmount (for COMPLETED)
   - changeAmount = paymentAmount - totalAmount

2. **Void Transaction**
   - Only COMPLETED transactions can be voided
   - Reason is required (min 3 chars)
   - Cannot void twice

3. **Edit Transaction**
   - Only PENDING can be edited by Kasir
   - COMPLETED can only be edited by Admin (special cases)

4. **Shift Linking**
   - Transactions should be linked to shift (auto in Phase 2)
   - Unlinked transactions not in shift reports

---

## 9. Database Indexes

For performance optimization:

```sql
-- Fast queries
@@index([createdAt])     -- Date range queries
@@index([userId])        -- Per kasir reports
@@index([status])        -- Filter by status
@@index([shiftId])       -- Shift reports
@@index([isVoid])        -- Void summary
```

---

## 10. Summary

### Total Transaction Types: **1**
- Transaction (with multiple states)

### Transaction States: **3**
1. PENDING (Order not paid)
2. COMPLETED (Order paid)
3. CANCELLED (Order cancelled)

### Payment Methods: **7**
1. CASH
2. QRIS
3. DEBIT
4. GRABFOOD
5. SHOPEEFOOD
6. GOFOOD
7. OTHER

### Special States (Phase 1): **2**
1. Voided (isVoid = true)
2. Discounted (discountAmount > 0)

---

## 11. Future Enhancements (Phase 2+)

- [ ] Split payment (multiple payment methods in 1 transaction)
- [ ] Partial payment (installment)
- [ ] Credit/Debit card authorization
- [ ] Refund transaction type (separate from void)
- [ ] Exchange transaction (return + new purchase)
- [ ] Gift card payment
- [ ] Loyalty points redemption

---

**Last Updated:** September 15, 2026  
**Version:** Phase 1 (v1.0)
