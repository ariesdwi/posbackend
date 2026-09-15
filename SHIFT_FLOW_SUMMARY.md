# Shift Flow Summary - Complete Guide

Panduan lengkap flow shift dari start sampai Z-Report.

---

## 🔄 Complete Shift Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                        SHIFT LIFECYCLE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣  START SHIFT                                                │
│      POST /shifts/start                                         │
│      ├─ Input: initialCash                                      │
│      └─ Status: OPEN                                            │
│                                                                 │
│  2️⃣  ACTIVE SHIFT (Multiple Transactions)                       │
│      POST /transactions (auto-linked to shift)                  │
│      ├─ Transaction 1 → shiftId linked                          │
│      ├─ Transaction 2 → shiftId linked                          │
│      └─ Transaction N → shiftId linked                          │
│                                                                 │
│  3️⃣  X-REPORT (Optional, Multiple Times)                        │
│      GET /shifts/x-report                                       │
│      ├─ Monitor penjualan real-time                             │
│      ├─ Check kas sementara                                     │
│      └─ Status: OPEN (shift masih jalan)                        │
│                                                                 │
│  4️⃣  PRE-CLOSE SHIFT                                            │
│      POST /shifts/pre-close                                     │
│      ├─ Input: finalCash (REQUIRED)                             │
│      ├─ Input: notes, technicalIssues (optional)                │
│      ├─ Backend: Calculate cash difference                      │
│      ├─ Backend: Close shift → Status: CLOSED                   │
│      └─ Response: previewZReport (warnings if any)              │
│                                                                 │
│  5️⃣  Z-REPORT (Final Report)                                    │
│      GET /shifts/{shiftId}/z-report                             │
│      ├─ Full reconciliation per payment method                  │
│      ├─ Cash reconciliation with difference                     │
│      ├─ Void & discount summary                                 │
│      ├─ Top products with profit margin                         │
│      └─ X-Report history                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Endpoints Summary

| Step | Method | Endpoint | Auth | Status Required |
|------|--------|----------|------|-----------------|
| Start | POST | `/shifts/start` | ✅ | No shift open |
| Current | GET | `/shifts/current` | ✅ | Any |
| X-Report | GET | `/shifts/x-report` | ✅ | OPEN shift |
| Pre-Close | POST | `/shifts/pre-close` | ✅ | OPEN shift |
| Z-Report | GET | `/shifts/{shiftId}/z-report` | ✅ | CLOSED shift |
| Get Shift | GET | `/shifts/{shiftId}` | ✅ | Any |

---

## 🎯 Key Differences: X-Report vs Z-Report

### Visual Comparison

```
┌─────────────────────────┬──────────────────────┬──────────────────────┐
│      FEATURE            │      X-REPORT        │      Z-REPORT        │
├─────────────────────────┼──────────────────────┼──────────────────────┤
│ Shift Status            │ OPEN                 │ CLOSED               │
│ Frequency               │ Multiple times       │ Once per shift       │
│ Purpose                 │ Monitoring           │ Final reconciliation │
│                         │                      │                      │
│ TIMING                  │                      │                      │
│ ├─ endTime              │ ❌ None              │ ✅ Available         │
│ └─ duration             │ ✅ Current           │ ✅ Total             │
│                         │                      │                      │
│ SALES DATA              │                      │                      │
│ ├─ totalSales           │ ✅ Current           │ ✅ Final             │
│ ├─ totalTransactions    │ ✅ Current           │ ✅ Final             │
│ └─ paymentBreakdown     │ ✅ Yes               │ ✅ Yes               │
│                         │                      │                      │
│ RECONCILIATION          │                      │                      │
│ ├─ finalCash            │ ❌ Not input yet     │ ✅ From pre-close    │
│ ├─ cashDifference       │ ❌ Can't calculate   │ ✅ Calculated        │
│ ├─ reconciliationStatus │ ❌ None              │ ✅ Per payment       │
│ └─ note                 │ ⚠️  "Belum ditutup"  │ ✅ Full notes        │
│                         │                      │                      │
│ VOID & DISCOUNT         │                      │                      │
│ ├─ voidCount            │ ✅ Count only        │ ✅ Count + detail    │
│ ├─ voidAmount           │ ✅ Total only        │ ✅ Total + detail    │
│ └─ voidTransactions     │ ❌ Not included      │ ✅ Full list         │
│                         │                      │                      │
│ TOP PRODUCTS            │                      │                      │
│ ├─ productName          │ ✅ Yes               │ ✅ Yes               │
│ ├─ quantitySold         │ ✅ Yes               │ ✅ Yes               │
│ ├─ revenue              │ ✅ Yes               │ ✅ Yes               │
│ └─ profitMargin         │ ❌ Not calculated    │ ✅ Calculated        │
│                         │                      │                      │
│ METADATA                │                      │                      │
│ ├─ xReportHistory       │ ❌ Not included      │ ✅ Total + last time │
│ ├─ shiftNotes           │ ❌ Not yet           │ ✅ From pre-close    │
│ ├─ technicalIssues      │ ❌ Not yet           │ ✅ From pre-close    │
│ └─ inventoryNotes       │ ❌ Not yet           │ ✅ From pre-close    │
└─────────────────────────┴──────────────────────┴──────────────────────┘
```

---

## 💰 Cash Reconciliation Flow

### X-Report (During Shift)
```
┌─────────────────────────────────────────┐
│   CASH RECONCILIATION (X-REPORT)        │
├─────────────────────────────────────────┤
│                                         │
│  Initial Cash:     Rp  54,000           │
│  Cash Sales:       Rp  22,000           │
│  ─────────────────────────────          │
│  Expected Cash:    Rp  76,000           │
│                                         │
│  Final Cash:       ❌ Belum diinput     │
│  Cash Difference:  ❌ Belum ada         │
│                                         │
│  Note: "Shift belum ditutup,            │
│         belum ada final count"          │
└─────────────────────────────────────────┘
```

### Pre-Close Input
```
┌─────────────────────────────────────────┐
│   PRE-CLOSE SHIFT INPUT                 │
├─────────────────────────────────────────┤
│                                         │
│  💵 Kas Akhir (WAJIB)                   │
│     Rp 80,000                           │
│                                         │
│  📝 Catatan                             │
│     "Test closing dengan selisih"       │
│                                         │
│  📦 Inventori                           │
│     "Stock normal"                      │
│                                         │
│  [Tutup Shift]                          │
└─────────────────────────────────────────┘
```

### Z-Report (After Close)
```
┌─────────────────────────────────────────┐
│   CASH RECONCILIATION (Z-REPORT)        │
├─────────────────────────────────────────┤
│                                         │
│  Initial Cash:     Rp  54,000           │
│  Cash Sales:       Rp  22,000           │
│  ─────────────────────────────          │
│  Expected Cash:    Rp  76,000           │
│  Final Cash:       Rp  80,000  ✅       │
│  ─────────────────────────────          │
│  Cash Difference:  Rp   4,000  ⚠️       │
│                                         │
│  Status: "OVER" (Kas lebih)             │
│  ⚠️  Selisih +Rp 4,000                  │
└─────────────────────────────────────────┘
```

---

## 📱 Payment Method Reconciliation (Z-Report Only)

### Example: Mixed Payment Methods

```
┌────────────────────────────────────────────────────────────────┐
│              PAYMENT METHOD BREAKDOWN (Z-REPORT)               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  💵 CASH (91.7%)                                               │
│     Total Sales:    Rp 22,000 (1 transaksi)                   │
│     ┌────────────────────────────────────────┐                │
│     │  Expected:     Rp 22,000               │                │
│     │  Settlement:   Rp 26,000  ⚠️           │                │
│     │  Difference:   Rp  4,000               │                │
│     │  Status:       OVER                    │                │
│     └────────────────────────────────────────┘                │
│                                                                │
│  📱 QRIS (8.3%)                                                │
│     Total Sales:    Rp 2,000 (1 transaksi)                    │
│     ┌────────────────────────────────────────┐                │
│     │  Expected:     Rp 2,000                │                │
│     │  Settlement:   null                    │                │
│     │  Difference:   Rp 0                    │                │
│     │  Status:       NOT_VERIFIED            │                │
│     └────────────────────────────────────────┘                │
│                                                                │
│  💳 DEBIT, GRABFOOD, etc. (0%)                                 │
│     Total Sales:    Rp 0                                       │
│     Status:         NOT_VERIFIED                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Reconciliation Status Meanings

| Status | Meaning | Description |
|--------|---------|-------------|
| `MATCHED` | ✅ Perfect | Settlement = Expected (no difference) |
| `OVER` | ⚠️ Lebih | Settlement > Expected (ada selisih lebih) |
| `SHORT` | ❌ Kurang | Settlement < Expected (ada selisih kurang) |
| `NOT_VERIFIED` | ℹ️ Belum Input | Settlement = null (belum di-verify) |

---

## 🔢 Report Number Format

### X-Report Number
```
Format: X-YYYYMMDD-HHMMSS-NNN

Example: X-20260915-141218-006
         │    │       │      │
         │    │       │      └─ Counter (incremented each X-Report)
         │    │       └──────── Time (14:12:18)
         │    └──────────────── Date (2026-09-15)
         └───────────────────── Report Type
```

**Karakteristik:**
- ✅ Includes timestamp untuk uniqueness
- ✅ Counter per shift (001, 002, 003, ...)
- ✅ Dapat di-generate berkali-kali
- ✅ Saved to database (`XReport` table)

### Z-Report Number
```
Format: Z-YYYYMMDD-KASIR-NNN

Example: Z-20260915-IPEH-001
         │    │      │    │
         │    │      │    └─ Counter per kasir per day
         │    │      └────── Kasir name (uppercase)
         │    └───────────── Date (2026-09-15)
         └────────────────── Report Type
```

**Karakteristik:**
- ✅ One per shift (cannot be regenerated)
- ✅ Includes kasir name
- ✅ Counter per kasir per day
- ✅ Permanent record

---

## 🎯 API Response Wrapper

All endpoints return data wrapped in standard format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    // X-Report or Z-Report data here
  },
  "timestamp": "2026-09-15T07:12:18.320Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Tidak ada shift aktif",
  "error": "Not Found",
  "timestamp": "2026-09-15T07:12:18.320Z",
  "path": "/shifts/x-report"
}
```

---

## ⚠️ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `404 - Tidak ada shift aktif` | No OPEN shift | Call `POST /shifts/start` first |
| `404 - Shift tidak ditemukan` | Invalid shiftId | Check shiftId from pre-close response |
| `401 - Unauthorized` | Token expired | Re-login to get fresh token |
| `400 - Shift already closed` | Try to close CLOSED shift | Cannot close twice |

---

## 🚀 Complete Flow Example (Kotlin)

### 1. Start Shift
```kotlin
val startResponse = shiftRepository.startShift(initialCash = 50000.0)
// shiftId: "abc123", status: "OPEN"
```

### 2. Create Transactions
```kotlin
val transaction1 = transactionRepository.createTransaction(
    items = listOf(TransactionItem("prod1", 2)),
    paymentMethod = "CASH",
    paymentAmount = 25000.0
)
// ✅ Auto-linked: transaction1.shiftId == "abc123"

val transaction2 = transactionRepository.createTransaction(
    items = listOf(TransactionItem("prod2", 1)),
    paymentMethod = "QRIS",
    paymentAmount = 5000.0
)
// ✅ Auto-linked: transaction2.shiftId == "abc123"
```

### 3. Generate X-Report (Optional, Multiple Times)
```kotlin
// First X-Report
val xReport1 = shiftRepository.getXReport()
// reportNumber: "X-20260915-100530-001"

// Second X-Report (1 hour later)
val xReport2 = shiftRepository.getXReport()
// reportNumber: "X-20260915-110630-002"
```

### 4. Pre-Close Shift
```kotlin
val preClose = shiftRepository.preCloseShift(
    finalCash = 78000.0,
    notes = "Semua transaksi sesuai"
)

// Check warnings
if (preClose.previewZReport.warnings.isNotEmpty()) {
    showDialog(
        message = preClose.previewZReport.warnings.joinToString("\n"),
        onConfirm = { navigateToZReport(preClose.shiftId) }
    )
} else {
    navigateToZReport(preClose.shiftId)
}
```

### 5. View Z-Report
```kotlin
val zReport = shiftRepository.getZReport(shiftId = preClose.shiftId)

// Display reconciliation
binding.apply {
    reportNumber.text = zReport.reportNumber
    totalSales.text = formatRupiah(zReport.salesSummary.totalSales)
    
    // Cash status
    when (zReport.cashReconciliation.status) {
        "PERFECT_MATCH" -> cashStatus.setSuccess()
        "OVER" -> cashStatus.setWarning("Kas lebih")
        "SHORT" -> cashStatus.setError("Kas kurang")
    }
    
    // Top products
    topProductsAdapter.submitList(zReport.topProducts)
}
```

---

## 📋 Checklist Implementation FE

### ✅ Models
- [ ] XReportResponse data class
- [ ] ZReportResponse data class
- [ ] PreCloseRequest data class
- [ ] PreCloseResponse data class (fix structure!)
- [ ] All nested data classes (reconciliation, summaries, etc.)

### ✅ Repository
- [ ] `getXReport()` - GET /shifts/x-report
- [ ] `preCloseShift(request)` - POST /shifts/pre-close
- [ ] `getZReport(shiftId)` - GET /shifts/{shiftId}/z-report

### ✅ ViewModels
- [ ] XReportViewModel
- [ ] PreCloseViewModel
- [ ] ZReportViewModel

### ✅ UI Screens
- [ ] XReportScreen (optional, for monitoring)
- [ ] PreCloseScreen (input finalCash + notes)
- [ ] ZReportScreen (final report display)

### ✅ Navigation
- [ ] ShiftManagement → PreClose
- [ ] PreClose → ZReport (after success)
- [ ] Handle warnings dialog

### ✅ Formatting
- [ ] formatRupiah() for currency
- [ ] formatPercentage() for percentages
- [ ] formatDateTime() for timestamps
- [ ] formatDuration() for shift duration

---

## 🎯 Testing Checklist

### Backend Testing (via cURL/Postman)
- [x] ✅ Start shift
- [x] ✅ Create transactions (auto-linked)
- [x] ✅ Generate X-Report (multiple times)
- [x] ✅ Pre-close shift (with warnings)
- [x] ✅ Get Z-Report (full reconciliation)

### FE Testing (Android)
- [ ] Login & start shift
- [ ] Create test transactions
- [ ] View X-Report
- [ ] Close shift with pre-close
- [ ] Handle warnings dialog
- [ ] View Z-Report
- [ ] Test cash reconciliation display
- [ ] Test payment method breakdown
- [ ] Test void/discount summaries
- [ ] Test top products with profit margin

---

**Complete shift flow documentation with actual backend responses!** 🚀
