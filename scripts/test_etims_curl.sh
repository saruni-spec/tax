#!/bin/bash

# eTIMS API Test Script with cURL
# Tests all endpoints with actual responses

echo "=========================================="
echo "eTIMS API Test - cURL Commands"
echo "Test User MSISDN: 254745050238"
echo "=========================================="
echo ""

# 1. Customer Lookup
echo "=== 1. CUSTOMER LOOKUP ==="
echo "curl -X POST 'https://kratest.pesaflow.com/api/ussd/buyer-initiated/lookup' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"pin_or_id\":\"A016678608H\"}'"
echo ""
echo "Response:"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/buyer-initiated/lookup' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"pin_or_id":"A016678608H"}'
echo ""
echo ""

# 2. Submit Sales Invoice
echo "=== 2. SUBMIT SALES INVOICE ==="
echo "curl -X POST 'https://kratest.pesaflow.com/api/ussd/post-sale' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"msisdn\":\"254745050238\",\"total_amount\":100,\"items\":[{\"item_name\":\"Test Item\",\"taxable_amount\":100,\"quantity\":1}]}'"
echo ""
echo "Response:"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/post-sale' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"msisdn":"254745050238","total_amount":100,"items":[{"item_name":"Test Item","taxable_amount":100,"quantity":1}]}'
echo ""
echo ""

# 3. Submit Buyer Initiated Invoice
echo "=== 3. SUBMIT BUYER INITIATED INVOICE ==="
echo "curl -X POST 'https://kratest.pesaflow.com/api/ussd/buyer-initiated/submit/invoice' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"msisdn\":\"254745050238\",\"buyer_pin\":\"A016678608H\",\"total_amount\":150,\"items\":[{\"item_name\":\"Consultation\",\"taxable_amount\":150,\"quantity\":1}]}'"
echo ""
echo "Response:"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/buyer-initiated/submit/invoice' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"msisdn":"254745050238","buyer_pin":"A016678608H","total_amount":150,"items":[{"item_name":"Consultation","taxable_amount":150,"quantity":1}]}'
echo ""
echo ""

# 4. Fetch Invoices
echo "=== 4. FETCH INVOICES (BUYER VIEW) ==="
echo "curl -X GET 'https://kratest.pesaflow.com/api/ussd/buyer-initiated/fetch/254745050238' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd'"
echo ""
echo "Response:"
curl -s -X GET 'https://kratest.pesaflow.com/api/ussd/buyer-initiated/fetch/254745050238' \
  -H 'x-forwarded-for: triple_2_ussd'
echo ""
echo ""

# 5. Process Invoice (Accept)
echo "=== 5. PROCESS INVOICE (ACCEPT) ==="
echo "curl -X POST 'https://kratest.pesaflow.com/api/ussd/buyer-initiated/action/submit' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"action\":\"accept\",\"msisdn\":\"254745050238\",\"invoice\":\"BI-DUMMY-123\"}'"
echo ""
echo "Response:"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/buyer-initiated/action/submit' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"action":"accept","msisdn":"254745050238","invoice":"BI-DUMMY-123"}'
echo ""
echo ""

# 6. Search Credit Note Invoice
echo "=== 6. SEARCH CREDIT NOTE INVOICE ==="
echo "curl -X POST 'https://kratest.pesaflow.com/api/ussd/search/credit-note' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"msisdn\":\"254745050238\",\"invoice_no\":\"INV-TEST-001\"}'"
echo ""
echo "Response:"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/search/credit-note' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"msisdn":"254745050238","invoice_no":"INV-TEST-001"}'
echo ""
echo ""

# 7. Submit Credit Note
echo "=== 7. SUBMIT CREDIT NOTE ==="
echo "curl -X POST 'https://kratest.pesaflow.com/api/ussd/submit/credit-note' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"msisdn\":\"254745050238\",\"invoice_no\":\"INV-TEST-001\",\"credit_note_type\":\"partial\",\"reason\":\"other\",\"items\":[{\"item_id\":\"ITEM-001\",\"return_quantity\":1}]}'"
echo ""
echo "Response:"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/submit/credit-note' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"msisdn":"254745050238","invoice_no":"INV-TEST-001","credit_note_type":"partial","reason":"other","items":[{"item_id":"ITEM-001","return_quantity":1}]}'
echo ""
echo ""

echo "=========================================="
echo "TEST COMPLETE"
echo "=========================================="
