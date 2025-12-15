# NIL-MRI-TOT Route API Analysis

## Date: 2025-12-15

---

## 1. APIs Used in `app/actions/tax-filing.ts`

| API Endpoint | Method | In Collections? | Notes |
|--------------|--------|-----------------|-------|
| `/api/itax/gui-lookup` | GET | ✅ Yes | Primary taxpayer lookup |
| `https://etims.1automations.com/buyer_lookup` | POST | ❌ No | Fallback taxpayer lookup (external) |
| `/api/ussd/obligation-filling-period` | POST | ✅ Yes | Get filing periods |
| `/api/ussd/file-return` | POST | ✅ Yes | File NIL, MRI, TOT returns |
| `/api/ussd/send-whatsapp-notification` | POST | ❌ No | **DOES NOT EXIST** - Marked as TODO |

---

## 2. Mock Data & Fallbacks

### Location: `app/actions/tax-filing.ts`

### 2.1 lookupTaxpayerById() - Lines 132-142
📍 **Mock Condition:** When both GUI Lookup and Buyer Lookup APIs fail AND ID is `12345678`
```typescript
if (idNumber === '12345678') {
  return {
    success: true,
    code: 3,
    message: 'Valid ID Number (Mock)',
    name: 'JOHN DOE',
    pin: idNumber,
    idNumber: idNumber,
  };
}
```
⚠️ **Issue:** Returns mock success instead of actual error

---

### 2.2 getFilingPeriods() - Lines 189-200
📍 **Mock Condition:** When API call fails (always returns mock on error)
```typescript
catch (error: any) {
  // Return mock periods for testing
  return {
    success: true,
    periods: [/* current month period */],
    message: 'Mock filing periods',
  };
}
```
⚠️ **Issue:** Returns mock success instead of actual error

---

### 2.3 fileNilReturn() - Lines 240-247 ⛔ CRITICAL
📍 **Mock Condition:** When API call fails (ALWAYS returns mock success!)
```typescript
catch (error: any) {
  console.error('File NIL Return Error:', error.response?.data || error.message);
  
  // Return mock success for testing
  return {
    success: true,
    code: 200,
    message: 'NIL Return filed successfully (Mock)',
    receiptNumber: `NIL-${Date.now()}`,
  };
}
```
⛔ **CRITICAL ISSUE:** Frontend shows SUCCESS even when API fails with "Internal Server Error"

---

### 2.4 fileMriReturn() - Lines 286-296 ⛔ CRITICAL
📍 **Mock Condition:** When API call fails (ALWAYS returns mock success!)
```typescript
catch (error: any) {
  console.error('File MRI Return Error:', error.response?.data || error.message);
  
  // Return mock success for testing
  return {
    success: true,
    code: 200,
    message: 'MRI Return filed successfully (Mock)',
    receiptNumber: `MRI-${Date.now()}`,
  };
}
```
⛔ **CRITICAL ISSUE:** This is exactly what you observed:
- Server logs: `File MRI Return Error: { errors: { detail: 'Internal Server Error' } }`
- Frontend shows: SUCCESS ✅

---

### 2.5 fileTotReturn() - Lines 337-347 ⛔ CRITICAL
📍 **Mock Condition:** When API call fails (ALWAYS returns mock success!)
```typescript
catch (error: any) {
  console.error('File TOT Return Error:', error.response?.data || error.message);
  
  // Return mock success for testing
  return {
    success: true,
    code: 200,
    message: 'TOT Return filed successfully (Mock)',
    receiptNumber: `TOT-${Date.now()}`,
  };
}
```
⛔ **CRITICAL ISSUE:** Frontend shows SUCCESS even when API fails

---

### 2.6 getTaxpayerObligations() - Lines 354-364
📍 **Mock:** 100% Mock (no real API call)
```typescript
export async function getTaxpayerObligations(pin: string): Promise<TaxpayerObligations> {
  // TODO: Replace with real API when available
  return {
    hasVATObligation: true,
    hasITRObligation: true,
    hasPAYEObligation: true,
    hasMRIObligation: true,
    hasTOTObligation: true,
  };
}
```
ℹ️ **Note:** This is intentionally mocked - API doesn't exist yet

---

### 2.7 sendWhatsAppNotification() - Lines 370-405
📍 **Mock:** 100% Mock (no real API call)
```typescript
// TODO: This endpoint needs to be implemented
// Expected: POST /api/ussd/send-whatsapp-notification
console.log('WhatsApp Notification Request:', {...});
return {
  success: true,
  message: `WhatsApp notification (${messageType}) would be sent to ${msisdn}`,
};
```
ℹ️ **Note:** This is intentionally mocked - API doesn't exist yet

---

## 3. Recommendations

### Immediate Fixes Required:
1. **Remove mock success responses from catch blocks** in:
   - `fileNilReturn()`
   - `fileMriReturn()`
   - `fileTotReturn()`
   
2. **Return actual errors** so frontend can display them:
```typescript
catch (error: any) {
  console.error('File MRI Return Error:', error.response?.data || error.message);
  return {
    success: false,
    code: error.response?.status || 500,
    message: error.response?.data?.message || 'Failed to file return',
  };
}
```

### Missing APIs to Implement:
1. `POST /api/ussd/send-whatsapp-notification` - For sending notifications
2. `GET /api/ussd/taxpayer-obligations` - For checking taxpayer obligations
