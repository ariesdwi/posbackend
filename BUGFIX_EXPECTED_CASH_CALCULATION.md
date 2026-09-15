# Bugfix: Expected Cash Calculation in getCurrentShift

## 🐛 Bug Report

**Reported Date:** 2026-09-15  
**Reported By:** Android FE (Aries)  
**Severity:** High - Core business logic error

### Issue Description

When calling `GET /shifts/current`, the `expectedCash` value returned `0` instead of the correct calculated value, causing the UI to show incorrect cash reconciliation data.

### Android Log Evidence
```
Initial Cash: 50000.0
Expected Cash: 0.0  ❌ WRONG!
Calculated Cash Sales: -50000.0  ❌ WRONG!
Total Sales: 2000.0
Total Transactions: 1
Total Cash to Deposit: 52000.0
```

### UI Screenshot Evidence
```
Modal Awal: Rp50.000
Penjualan Tunai: -Rp50.000  ❌ WRONG! (should be +Rp2.000)
Kas Seharusnya: Rp0  ❌ WRONG! (should be Rp52.000)

⚠️ Warning: "Pastikan Anda sudah menghitung kas fisik dengan teliti sebelum menutup shift."
```

---

## 🔍 Root Cause Analysis

### The Problem

In `shifts.service.ts`, the `buildShiftReport()` method was reading `expectedCash` directly from the database:

```typescript
// ❌ WRONG - Reading from DB (NULL/0 during OPEN shift)
expectedCash: Number(shift.expectedCash),
```

The `shift.expectedCash` field in database is only populated **AFTER** the shift is closed via `preCloseShift()`. During an OPEN shift, this field is `NULL` or `0`, which caused the bug.

### Expected Behavior

`expectedCash` should be **calculated in real-time** based on:
```
expectedCash = initialCash + cashSales
```

Where:
- `initialCash` = Modal awal (from shift start)
- `cashSales` = Sum of all COMPLETED CASH transactions (non-void)

---

## ✅ The Fix

### File: `src/shifts/shifts.service.ts`

**Before (WRONG):**
```typescript
private buildShiftReport(shift: any, transactions: any[]): ShiftReportResponseDto {
  // ... calculation logic ...
  
  const initialCash = Number(shift.initialCash);
  const totalCashToDeposit =
    initialCash + salesByPaymentMethod.cash.expectedCashFromSales;
  const actualCashInHand = shift.finalCash ? Number(shift.finalCash) : null;

  return {
    // ... other fields ...
    initialCash,
    finalCash: actualCashInHand,
    expectedCash: Number(shift.expectedCash),  // ❌ Reading from DB (NULL/0)
    // ...
  };
}
```

**After (CORRECT):**
```typescript
private buildShiftReport(shift: any, transactions: any[]): ShiftReportResponseDto {
  // ... calculation logic ...
  
  const initialCash = Number(shift.initialCash);
  const cashSales = salesByPaymentMethod.cash.expectedCashFromSales;
  
  // ✅ Calculate expectedCash in real-time (not from DB)
  const expectedCash = initialCash + cashSales;
  const totalCashToDeposit = expectedCash;
  const actualCashInHand = shift.finalCash ? Number(shift.finalCash) : null;

  return {
    // ... other fields ...
    initialCash,
    finalCash: actualCashInHand,
    expectedCash: expectedCash,  // ✅ Real-time calculation
    // ...
  };
}
```

---

## 🧪 Testing

### Test Case 1: OPEN Shift with 1 CASH Transaction

**Given:**
- Initial Cash: Rp 50,000
- 1 CASH transaction: Rp 2,000

**Expected Response:**
```json
{
  "initialCash": 50000,
  "expectedCash": 52000,  // ✅ 50000 + 2000
  "cashSales": 2000,
  "totalCashToDeposit": 52000
}
```

**Test Command:**
```bash
curl -X GET "http://localhost:3000/shifts/current" \
  -H "Authorization: Bearer $TOKEN"
```

**Result:** ✅ PASSED

---

### Test Case 2: OPEN Shift with Multiple CASH Transactions

**Given:**
- Initial Cash: Rp 50,000
- Transaction 1 (CASH): Rp 2,000
- Transaction 2 (CASH): Rp 2,000

**Expected Response:**
```json
{
  "initialCash": 50000,
  "expectedCash": 54000,  // ✅ 50000 + 2000 + 2000
  "cashSales": 4000,
  "totalTransactions": 2,
  "totalCashToDeposit": 54000
}
```

**Test Command:**
```bash
# Create transaction
curl -X POST "http://localhost:3000/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"productId":"xxx","quantity":1}],"paymentMethod":"CASH",...}'

# Check shift
curl -X GET "http://localhost:3000/shifts/current" \
  -H "Authorization: Bearer $TOKEN"
```

**Result:** ✅ PASSED

---

### Test Case 3: Pre-Close with Cash Difference

**Given:**
- Expected Cash: Rp 54,000
- Final Cash Input: Rp 55,000
- Cash Difference: +Rp 1,000 (OVER)

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "shiftId": "abc123",
    "status": "CLOSED",
    "previewZReport": {
      "cashDifference": 1000,
      "reconciliationStatus": "OVER",
      "warnings": [
        "Cash lebih Rp 1.000. Mohon cek kembali atau catat di notes."
      ]
    },
    "message": "Shift berhasil ditutup. Z-Report tersedia."
  }
}
```

**Test Command:**
```bash
curl -X POST "http://localhost:3000/shifts/pre-close" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"finalCash": 55000, "notes": "Test"}'
```

**Result:** ✅ PASSED

---

## 📊 Impact Analysis

### Affected Endpoints

| Endpoint | Impact | Fixed |
|----------|--------|-------|
| `GET /shifts/current` | ✅ Fixed | Yes |
| `GET /shifts/{shiftId}` | ✅ Fixed | Yes |
| `POST /shifts/pre-close` | ✅ No impact | N/A (was correct) |
| `GET /shifts/x-report` | ✅ No impact | N/A (different logic) |
| `GET /shifts/{shiftId}/z-report` | ✅ No impact | N/A (uses DB value correctly) |

### Why Other Endpoints Not Affected

1. **`POST /shifts/pre-close`**  
   This endpoint calculates `expectedCash` independently from transactions, not from `shift.expectedCash` field. It was working correctly.

2. **`GET /shifts/x-report`**  
   X-Report has its own calculation logic and doesn't use `buildShiftReport()` method.

3. **`GET /shifts/{shiftId}/z-report`**  
   Z-Report is only called **after** shift is closed. At that point, `shift.expectedCash` in DB is already populated by `preCloseShift()`, so reading from DB is correct.

---

## 🎯 Business Logic Clarification

### Expected Cash Calculation Rules

```
FOR OPEN SHIFT (status = 'OPEN'):
  expectedCash = initialCash + SUM(CASH transactions)
  
FOR CLOSED SHIFT (status = 'CLOSED'):
  expectedCash = value from DB (populated by pre-close)
```

### Why Two Different Approaches?

1. **During OPEN Shift:**
   - Shift is still active
   - Transactions can still come in
   - Must calculate real-time from transactions
   - `shift.expectedCash` in DB is still NULL/0

2. **After CLOSED Shift:**
   - Shift is finalized
   - No more transactions
   - `shift.expectedCash` saved to DB by `preCloseShift()`
   - Reading from DB is correct and efficient

### The Fix Makes Both Cases Work

```typescript
const expectedCash = initialCash + cashSales;  // ✅ Always correct
```

This works because:
- **OPEN shift**: Calculates from current transactions
- **CLOSED shift**: `cashSales` is frozen (no new transactions), result matches DB value

---

## 🚀 Deployment

### Files Changed
- `src/shifts/shifts.service.ts` (lines ~283-295)

### Deployment Steps
1. ✅ Code fixed locally
2. ✅ Tested via cURL
3. ✅ Verified with Android FE
4. [ ] Commit changes
5. [ ] Push to production (Vercel)
6. [ ] Re-test on production

### Git Commit Message
```
fix(shifts): calculate expectedCash real-time instead of reading from DB

- Fixed expectedCash returning 0 during OPEN shift
- Changed buildShiftReport() to calculate expectedCash from transactions
- Formula: expectedCash = initialCash + cashSales
- Affects GET /shifts/current and GET /shifts/{shiftId}
- Closes #BUG-001
```

---

## 📱 Impact on Android FE

### Before Fix
```
Modal Awal: Rp 50.000
Penjualan Tunai: -Rp 50.000  ❌
Kas Seharusnya: Rp 0  ❌
```

### After Fix
```
Modal Awal: Rp 50.000  ✅
Penjualan Tunai: +Rp 4.000  ✅
Kas Seharusnya: Rp 54.000  ✅
```

### FE Changes Required
**None!** The FE logic was correct. It was just receiving wrong data from backend. After backend fix, FE will automatically show correct values.

---

## ✅ Checklist

- [x] Bug identified and reproduced
- [x] Root cause analyzed
- [x] Fix implemented
- [x] Local testing completed
- [x] Test case 1 passed (single CASH transaction)
- [x] Test case 2 passed (multiple CASH transactions)
- [x] Test case 3 passed (pre-close with difference)
- [x] Documentation created
- [ ] Code review
- [ ] Deploy to production
- [ ] Production testing with Android FE
- [ ] Close bug ticket

---

## 📝 Lessons Learned

1. **Don't trust DB fields during intermediate states**  
   Fields that are only populated at the end of a process (like `expectedCash` after close) should not be read during the process (OPEN shift).

2. **Calculate real-time when possible**  
   For active/ongoing processes, calculate from current state rather than stored values.

3. **Test with actual FE early**  
   The bug was caught by Android FE testing. Backend unit tests didn't catch it because they might not have tested OPEN shift scenario.

4. **Clear separation of concerns**  
   - `buildShiftReport()` → Real-time calculation for OPEN shifts
   - `preCloseShift()` → Save calculated values for CLOSED shifts
   - `getZReport()` → Read saved values from CLOSED shifts

---

**Bug Fixed!** ✅  
**Date:** 2026-09-15  
**Fixed By:** Kiro AI Assistant
