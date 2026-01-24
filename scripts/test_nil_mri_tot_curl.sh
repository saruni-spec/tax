#!/bin/bash

# NIL-MRI-TOT API Test Script
# Tests all endpoints in the order they are called by the frontend

echo "=========================================="
echo "NIL-MRI-TOT API Test - cURL Commands"
echo "Test User: 254745050238"
echo "Test PIN: A016678608H"
echo "=========================================="
echo ""

# Step 1: GUI Lookup (Taxpayer Validation)
echo "=== 1. GUI LOOKUP (Taxpayer Validation) ==="
echo "Used in: /nil-mri-tot/*/validation"
echo ""
echo "curl -X GET 'process.env.API_URL/itax/gui-lookup?gui=36447996&tax_payer_type=KE' \\"
echo "  -H 'x-source-for: whatsapp'"
echo ""
echo "Response:"
curl -s -X GET 'process.env.API_URL/itax/gui-lookup?gui=36447996&tax_payer_type=KE' \
  -H 'x-source-for: whatsapp'
echo ""
echo ""

# Step 2: Fetch Filing Periods (NIL)
echo "=== 2. FETCH FILING PERIODS (NIL - obligation_id: 1) ==="
echo "Used in: /nil-mri-tot/nil/select"
echo ""
echo "curl -X POST 'process.env.API_URL/ussd/obligation-filling-period' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"branch_id\":\"\",\"from_date\":\"\",\"from_itms_or_prtl\":\"PRTL\",\"is_amended\":\"N\",\"obligation_id\":\"1\",\"pin\":\"A016678608H\"}'"
echo ""
echo "Response:"
curl -s -X POST 'process.env.API_URL/ussd/obligation-filling-period' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"branch_id":"","from_date":"","from_itms_or_prtl":"PRTL","is_amended":"N","obligation_id":"1","pin":"A016678608H"}'
echo ""
echo ""

# Step 3: Fetch Filing Periods (MRI - obligation_id: 33)
echo "=== 3. FETCH FILING PERIODS (MRI - obligation_id: 33) ==="
echo "Used in: /nil-mri-tot/mri/obligation"
echo ""
echo "curl -X POST 'process.env.API_URL/ussd/obligation-filling-period' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"branch_id\":\"\",\"from_date\":\"\",\"from_itms_or_prtl\":\"PRTL\",\"is_amended\":\"N\",\"obligation_id\":\"33\",\"pin\":\"A016678608H\"}'"
echo ""
echo "Response:"
curl -s -X POST 'process.env.API_URL/ussd/obligation-filling-period' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"branch_id":"","from_date":"","from_itms_or_prtl":"PRTL","is_amended":"N","obligation_id":"33","pin":"A016678608H"}'
echo ""
echo ""

# Step 4: Fetch Filing Periods (TOT - obligation_id: 8)
echo "=== 4. FETCH FILING PERIODS (TOT - obligation_id: 8) ==="
echo "Used in: /nil-mri-tot/tot/obligation"
echo ""
echo "curl -X POST 'process.env.API_URL/ussd/obligation-filling-period' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"branch_id\":\"\",\"from_date\":\"\",\"from_itms_or_prtl\":\"PRTL\",\"is_amended\":\"N\",\"obligation_id\":\"8\",\"pin\":\"A016678608H\"}'"
echo ""
echo "Response:"
curl -s -X POST 'process.env.API_URL/ussd/obligation-filling-period' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"branch_id":"","from_date":"","from_itms_or_prtl":"PRTL","is_amended":"N","obligation_id":"8","pin":"A016678608H"}'
echo ""
echo ""

# Step 5: File NIL Return
echo "=== 5. FILE NIL RETURN ==="
echo "Used in: /nil-mri-tot/nil/verify -> result"
echo ""
echo "curl -X POST 'process.env.API_URL/ussd/file-return' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"kra_obligation_id\":\"1\",\"returnPeriod\":\"01/12/2024 - 31/12/2024\",\"returnType\":\"nil_return\",\"tax_payer_pin\":\"A016678608H\"}'"
echo ""
echo "Response:"
curl -s -X POST 'process.env.API_URL/ussd/file-return' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"kra_obligation_id":"1","returnPeriod":"01/12/2024 - 31/12/2024","returnType":"nil_return","tax_payer_pin":"A016678608H"}'
echo ""
echo ""

# Step 6: File MRI Return
echo "=== 6. FILE MRI RETURN ==="
echo "Used in: /nil-mri-tot/mri/rental-income -> result"
echo ""
echo "curl -X POST 'process.env.API_URL/ussd/file-return' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"kra_obligation_id\":\"33\",\"returnPeriod\":\"01/12/2024 - 31/12/2024\",\"returnType\":\"mri_return\",\"tax_payer_pin\":\"A016678608H\",\"rental_income\":50000,\"tax_amount\":5000}'"
echo ""
echo "Response:"
curl -s -X POST 'process.env.API_URL/ussd/file-return' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"kra_obligation_id":"33","returnPeriod":"01/12/2024 - 31/12/2024","returnType":"mri_return","tax_payer_pin":"A016678608H","rental_income":50000,"tax_amount":5000}'
echo ""
echo ""

# Step 7: File TOT Return (Daily)
echo "=== 7. FILE TOT RETURN (Daily) ==="
echo "Used in: /nil-mri-tot/tot/daily -> result"
echo ""
echo "curl -X POST 'process.env.API_URL/ussd/file-return' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"kra_obligation_id\":\"8\",\"returnPeriod\":\"15/12/2024\",\"returnType\":\"tot_return\",\"tax_payer_pin\":\"A016678608H\",\"gross_sales\":100000,\"tax_amount\":3000,\"filing_mode\":\"daily\"}'"
echo ""
echo "Response:"
curl -s -X POST 'process.env.API_URL/ussd/file-return' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"kra_obligation_id":"8","returnPeriod":"15/12/2024","returnType":"tot_return","tax_payer_pin":"A016678608H","gross_sales":100000,"tax_amount":3000,"filing_mode":"daily"}'
echo ""
echo ""

# Step 8: File TOT Return (Monthly)
echo "=== 8. FILE TOT RETURN (Monthly) ==="
echo "Used in: /nil-mri-tot/tot/monthly -> result"
echo ""
echo "curl -X POST 'process.env.API_URL/ussd/file-return' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'x-forwarded-for: triple_2_ussd' \\"
echo "  -d '{\"kra_obligation_id\":\"8\",\"returnPeriod\":\"01/12/2024 - 31/12/2024\",\"returnType\":\"tot_return\",\"tax_payer_pin\":\"A016678608H\",\"gross_sales\":500000,\"tax_amount\":15000,\"filing_mode\":\"monthly\"}'"
echo ""
echo "Response:"
curl -s -X POST 'process.env.API_URL/ussd/file-return' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"kra_obligation_id":"8","returnPeriod":"01/12/2024 - 31/12/2024","returnType":"tot_return","tax_payer_pin":"A016678608H","gross_sales":500000,"tax_amount":15000,"filing_mode":"monthly"}'
echo ""
echo ""

echo "=========================================="
echo "TEST COMPLETE"
echo "=========================================="
