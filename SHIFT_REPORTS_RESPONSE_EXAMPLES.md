# Shift Reports - Response Examples

Complete response examples untuk X-Report dan Z-Report endpoints.

---

## 📊 X-REPORT (During Active Shift)

### Endpoint
```
GET /shifts/x-report
Authorization: Bearer <token>
```

### Purpose
Generate laporan sementara saat shift masih berjalan (OPEN status). Bisa di-generate berkali-kali untuk monitoring real-time.

### Response Example

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "reportType": "X-REPORT",
    "reportNumber": "X-20260915-141218-006",
    "generatedAt": "2026-09-15T07:12:18.320Z",
    "shift": {
      "shiftId": "cmu288xsb000004l0gqt6sh4o",
      "kasirName": "Ipeh",
      "startTime": "2026-09-15T05:24:26.498Z",
      "duration": "1 hours 47 minutes",
      "status": "OPEN"
    },
    "summary": {
      "totalSales": 24000,
      "totalTransactions": 2,
      "averageTransaction": 12000,
      "itemsSold": 2
    },
    "paymentMethodBreakdown": {
      "cash": {
        "totalSales": 22000,
        "transactions": 1,
        "percentage": 91.7
      },
      "qris": {
        "totalSales": 2000,
        "transactions": 1,
        "percentage": 8.3
      },
      "debit": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0
      },
      "grabfood": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0
      },
      "shopeefood": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0
      },
      "gofood": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0
      },
      "other": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0
      }
    },
    "voidSummary": {
      "totalVoidCount": 0,
      "totalVoidAmount": 0
    },
    "discountSummary": {
      "totalDiscountGiven": 0,
      "averageDiscount": 0
    },
    "topProducts": [
      {
        "productName": "Ayam Bumbu Hitam",
        "quantitySold": 1,
        "revenue": 22000
      },
      {
        "productName": "Air Es",
        "quantitySold": 1,
        "revenue": 2000
      }
    ],
    "cashReconciliation": {
      "initialCash": 54000,
      "cashSales": 22000,
      "expectedCash": 76000,
      "note": "Shift belum ditutup, belum ada final count"
    }
  },
  "timestamp": "2026-09-15T07:12:18.320Z"
}
```

### Key Points - X-Report

| Field | Type | Description |
|-------|------|-------------|
| `reportType` | String | Always "X-REPORT" |
| `reportNumber` | String | Format: `X-YYYYMMDD-HHMMSS-NNN` (unique per generation) |
| `shift.status` | String | Always "OPEN" (shift masih aktif) |
| `summary.totalSales` | Number | Total penjualan (Rp) |
| `summary.totalTransactions` | Number | Jumlah transaksi COMPLETED |
| `paymentMethodBreakdown` | Object | Breakdown per payment method dengan percentage |
| `voidSummary` | Object | Total transaksi yang di-void |
| `discountSummary` | Object | Total discount yang diberikan |
| `topProducts` | Array | Top 5 produk terlaris |
| `cashReconciliation.note` | String | "Shift belum ditutup, belum ada final count" |

---

## 📈 Z-REPORT (After Shift Closed)

### Endpoint
```
GET /shifts/{shiftId}/z-report
Authorization: Bearer <token>
```

### Purpose
Generate laporan final setelah shift ditutup (CLOSED status). Berisi rekonsiliasi lengkap, termasuk cash difference dan settlement.

### Response Example

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "reportType": "Z-REPORT",
    "reportNumber": "Z-20260915-IPEH-001",
    "generatedAt": "2026-09-15T07:12:47.192Z",
    "shift": {
      "shiftId": "cmu288xsb000004l0gqt6sh4o",
      "kasirName": "Ipeh",
      "startTime": "2026-09-15T05:24:26.498Z",
      "endTime": "2026-09-15T07:12:33.122Z",
      "duration": "1 hours",
      "status": "CLOSED"
    },
    "salesSummary": {
      "totalSales": 24000,
      "totalTransactions": 2,
      "averageTransaction": 12000,
      "itemsSold": 2
    },
    "paymentMethodBreakdown": {
      "cash": {
        "totalSales": 22000,
        "transactions": 1,
        "percentage": 91.7,
        "reconciliation": {
          "expected": 22000,
          "settlement": 26000,
          "difference": 4000,
          "status": "OVER"
        }
      },
      "qris": {
        "totalSales": 2000,
        "transactions": 1,
        "percentage": 8.3,
        "reconciliation": {
          "expected": 2000,
          "settlement": null,
          "difference": 0,
          "status": "NOT_VERIFIED"
        }
      },
      "debit": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0,
        "reconciliation": {
          "expected": 0,
          "settlement": null,
          "difference": 0,
          "status": "NOT_VERIFIED"
        }
      },
      "grabfood": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0,
        "reconciliation": {
          "expected": 0,
          "settlement": null,
          "difference": 0,
          "status": "NOT_VERIFIED"
        }
      },
      "shopeefood": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0,
        "reconciliation": {
          "expected": 0,
          "settlement": null,
          "difference": 0,
          "status": "NOT_VERIFIED"
        }
      },
      "gofood": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0,
        "reconciliation": {
          "expected": 0,
          "settlement": null,
          "difference": 0,
          "status": "NOT_VERIFIED"
        }
      },
      "other": {
        "totalSales": 0,
        "transactions": 0,
        "percentage": 0,
        "reconciliation": {
          "expected": 0,
          "settlement": null,
          "difference": 0,
          "status": "NOT_VERIFIED"
        }
      }
    },
    "cashReconciliation": {
      "initialCash": 54000,
      "cashSales": 22000,
      "expectedCash": 76000,
      "finalCash": 80000,
      "cashDifference": 4000,
      "status": "OVER"
    },
    "voidSummary": {
      "totalVoidCount": 0,
      "totalVoidAmount": 0,
      "voidTransactions": []
    },
    "discountSummary": {
      "totalDiscountGiven": 0,
      "discountCount": 0,
      "averageDiscount": 0
    },
    "topProducts": [
      {
        "productName": "Ayam Bumbu Hitam",
        "quantitySold": 1,
        "revenue": 22000,
        "profitMargin": 21.2
      },
      {
        "productName": "Air Es",
        "quantitySold": 1,
        "revenue": 2000,
        "profitMargin": 75
      }
    ],
    "xReportHistory": {
      "totalXReports": 6,
      "lastXReportAt": "2026-09-15T07:12:18.177Z"
    },
    "notes": {
      "shiftNotes": "Test closing shift dengan sedikit selisih",
      "technicalIssues": null,
      "inventoryNotes": "Stock normal"
    }
  },
  "timestamp": "2026-09-15T07:12:47.193Z"
}
```

### Key Points - Z-Report

| Field | Type | Description |
|-------|------|-------------|
| `reportType` | String | Always "Z-REPORT" |
| `reportNumber` | String | Format: `Z-YYYYMMDD-KASIR-NNN` (1 per shift) |
| `shift.status` | String | Always "CLOSED" |
| `shift.endTime` | String | Waktu penutupan shift (ISO 8601) |
| `paymentMethodBreakdown[].reconciliation` | Object | ✅ Ada reconciliation detail! |
| `reconciliation.expected` | Number | Yang seharusnya (dari transaksi) |
| `reconciliation.settlement` | Number/null | Yang dilaporkan (dari finalCash) |
| `reconciliation.difference` | Number | Selisih (settlement - expected) |
| `reconciliation.status` | String | "MATCHED" / "OVER" / "SHORT" / "NOT_VERIFIED" |
| `cashReconciliation` | Object | Summary cash reconciliation |
| `cashReconciliation.status` | String | "PERFECT_MATCH" / "OVER" / "SHORT" |
| `voidSummary.voidTransactions` | Array | Detail transaksi yang di-void |
| `topProducts[].profitMargin` | Number | ✅ Profit margin percentage (only in Z-Report) |
| `xReportHistory` | Object | Berapa kali X-Report di-generate selama shift |
| `notes` | Object | Catatan dari pre-close (shiftNotes, technicalIssues, inventoryNotes) |

---

## 🔄 Comparison: X-Report vs Z-Report

| Feature | X-Report | Z-Report |
|---------|----------|----------|
| **When** | During shift (OPEN) | After shift closed (CLOSED) |
| **Frequency** | Multiple times | Once per shift |
| **Report Number** | `X-YYYYMMDD-HHMMSS-NNN` | `Z-YYYYMMDD-KASIR-NNN` |
| **endTime** | ❌ Not available | ✅ Available |
| **reconciliation** | ❌ Not available | ✅ Per payment method |
| **finalCash** | ❌ Not available | ✅ Available |
| **cashDifference** | ❌ Not available | ✅ Available |
| **profitMargin** | ❌ Not in topProducts | ✅ In topProducts |
| **voidTransactions** | ❌ Count only | ✅ Full detail |
| **notes** | ❌ Not available | ✅ All notes from pre-close |
| **xReportHistory** | ❌ Not available | ✅ Available |

---

## 🎯 Reconciliation Status Values

### Cash Reconciliation Status
```
"PERFECT_MATCH" → finalCash = expectedCash (difference = 0)
"OVER"          → finalCash > expectedCash (kas lebih)
"SHORT"         → finalCash < expectedCash (kas kurang)
```

### Payment Method Reconciliation Status
```
"MATCHED"       → settlement = expected (cocok)
"OVER"          → settlement > expected (lebih)
"SHORT"         → settlement < expected (kurang)
"NOT_VERIFIED"  → settlement = null (belum diverifikasi)
```

---

## 📱 FE Model Recommendations

### X-Report Response Model

```kotlin
data class XReportResponse(
    val reportType: String,          // "X-REPORT"
    val reportNumber: String,        // "X-20260915-141218-006"
    val generatedAt: String,         // ISO 8601
    val shift: XReportShift,
    val summary: SalesSummary,
    val paymentMethodBreakdown: Map<String, PaymentMethodSummary>,
    val voidSummary: VoidSummary,
    val discountSummary: DiscountSummary,
    val topProducts: List<TopProduct>,
    val cashReconciliation: XReportCashReconciliation
)

data class XReportShift(
    val shiftId: String,
    val kasirName: String,
    val startTime: String,           // ISO 8601
    val duration: String,            // "1 hours 47 minutes"
    val status: String               // "OPEN"
)

data class XReportCashReconciliation(
    val initialCash: Double,
    val cashSales: Double,
    val expectedCash: Double,
    val note: String                 // "Shift belum ditutup..."
)

data class PaymentMethodSummary(
    val totalSales: Double,
    val transactions: Int,
    val percentage: Double
)

data class TopProduct(
    val productName: String,
    val quantitySold: Int,
    val revenue: Double
)
```

### Z-Report Response Model

```kotlin
data class ZReportResponse(
    val reportType: String,          // "Z-REPORT"
    val reportNumber: String,        // "Z-20260915-IPEH-001"
    val generatedAt: String,         // ISO 8601
    val shift: ZReportShift,
    val salesSummary: SalesSummary,
    val paymentMethodBreakdown: Map<String, PaymentMethodDetail>,
    val cashReconciliation: CashReconciliation,
    val voidSummary: VoidDetailSummary,
    val discountSummary: DiscountSummary,
    val topProducts: List<TopProductWithProfit>,
    val xReportHistory: XReportHistory,
    val notes: ShiftNotes
)

data class ZReportShift(
    val shiftId: String,
    val kasirName: String,
    val startTime: String,           // ISO 8601
    val endTime: String,             // ISO 8601
    val duration: String,            // "1 hours"
    val status: String               // "CLOSED"
)

data class PaymentMethodDetail(
    val totalSales: Double,
    val transactions: Int,
    val percentage: Double,
    val reconciliation: Reconciliation  // ✅ Only in Z-Report
)

data class Reconciliation(
    val expected: Double,
    val settlement: Double?,         // Nullable
    val difference: Double,
    val status: String               // MATCHED/OVER/SHORT/NOT_VERIFIED
)

data class CashReconciliation(
    val initialCash: Double,
    val cashSales: Double,
    val expectedCash: Double,
    val finalCash: Double,           // ✅ Only in Z-Report
    val cashDifference: Double,      // ✅ Only in Z-Report
    val status: String               // PERFECT_MATCH/OVER/SHORT
)

data class VoidDetailSummary(
    val totalVoidCount: Int,
    val totalVoidAmount: Double,
    val voidTransactions: List<VoidTransaction>  // ✅ Only in Z-Report
)

data class VoidTransaction(
    val transactionNumber: String,
    val amount: Double,
    val reason: String,
    val voidedAt: String             // ISO 8601
)

data class TopProductWithProfit(
    val productName: String,
    val quantitySold: Int,
    val revenue: Double,
    val profitMargin: Double         // ✅ Only in Z-Report
)

data class XReportHistory(
    val totalXReports: Int,
    val lastXReportAt: String?       // ISO 8601, nullable
)

data class ShiftNotes(
    val shiftNotes: String?,
    val technicalIssues: String?,
    val inventoryNotes: String?
)

data class SalesSummary(
    val totalSales: Double,
    val totalTransactions: Int,
    val averageTransaction: Double,
    val itemsSold: Int
)

data class VoidSummary(
    val totalVoidCount: Int,
    val totalVoidAmount: Double
)

data class DiscountSummary(
    val totalDiscountGiven: Double,
    val discountCount: Int = 0,      // Only in Z-Report
    val averageDiscount: Double
)
```

---

## 🚀 Usage Examples

### Generate X-Report (During Shift)
```kotlin
// Can be called multiple times
val xReport = shiftRepository.getXReport()

// Display in UI
binding.reportNumber.text = xReport.reportNumber
binding.totalSales.text = formatRupiah(xReport.summary.totalSales)
binding.totalTransactions.text = "${xReport.summary.totalTransactions} transaksi"
```

### Generate Z-Report (After Shift Closed)
```kotlin
// Only after preCloseShift() success
val zReport = shiftRepository.getZReport(shiftId)

// Check cash reconciliation
when (zReport.cashReconciliation.status) {
    "PERFECT_MATCH" -> showSuccess()
    "OVER" -> showWarning("Kas lebih Rp ${zReport.cashReconciliation.cashDifference}")
    "SHORT" -> showWarning("Kas kurang Rp ${Math.abs(zReport.cashReconciliation.cashDifference)}")
}

// Show payment method reconciliation
zReport.paymentMethodBreakdown.forEach { (method, detail) ->
    if (detail.reconciliation.status != "MATCHED") {
        showReconciliationWarning(method, detail.reconciliation)
    }
}
```

---

## 📝 Notes

1. **X-Report Number Format:** `X-YYYYMMDD-HHMMSS-NNN`
   - Includes timestamp untuk avoid duplicate
   - Counter increment setiap generate

2. **Z-Report Number Format:** `Z-YYYYMMDD-KASIR-NNN`
   - 1 Z-Report per shift
   - Include kasir name
   - Counter per kasir per day

3. **Reconciliation Status:**
   - `MATCHED` = Perfect match
   - `OVER` = Lebih dari expected
   - `SHORT` = Kurang dari expected
   - `NOT_VERIFIED` = Settlement tidak di-input

4. **Cash Reconciliation Formula:**
   ```
   expectedCash = initialCash + cashSales
   cashDifference = finalCash - expectedCash
   ```

5. **Profit Margin Calculation:**
   ```
   profitMargin = ((price - costPrice) / price) * 100
   ```

---

**Documentation berdasarkan actual backend response dari production system.** ✅
