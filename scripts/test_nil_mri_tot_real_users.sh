#!/bin/bash

# NIL-MRI-TOT API Test with Real Registered Users
# Date: 2025-12-15

echo "=========================================="
echo "NIL-MRI-TOT API Test with Real Users"
echo "=========================================="
echo ""

# MRI User Test
echo "=== MRI USER: A000093432C (Boniface Nyaga Ita) ==="
echo "ID: 3490631 | DOB: 24/04/1954"
echo ""
echo "1. GUI Lookup:"
curl -s -X GET 'https://kratest.pesaflow.com/api/itax/gui-lookup?gui=3490631&tax_payer_type=KE' -H 'x-source-for: whatsapp'
echo ""
echo ""
echo "2. Filing Periods (MRI - obligation_id: 33):"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/obligation-filling-period' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"branch_id":"","from_date":"","from_itms_or_prtl":"PRTL","is_amended":"N","obligation_id":"33","pin":"A000093432C"}'
echo ""
echo ""
echo "3. File MRI Return:"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/file-return' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"kra_obligation_id":"33","returnPeriod":"01/10/2025 - 31/10/2025","returnType":"mri_return","tax_payer_pin":"A000093432C","rental_income":50000,"tax_amount":5000}'
echo ""
echo ""

# TOT User Test
echo "=========================================="
echo "=== TOT USER: A012767201R (FREDRICK MUEMA KAMUYU) ==="
echo "ID: 30848670 | DOB: 24/03/1991"
echo ""
echo "1. GUI Lookup:"
curl -s -X GET 'https://kratest.pesaflow.com/api/itax/gui-lookup?gui=30848670&tax_payer_type=KE' -H 'x-source-for: whatsapp'
echo ""
echo ""
echo "2. Filing Periods (TOT - obligation_id: 8):"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/obligation-filling-period' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"branch_id":"","from_date":"","from_itms_or_prtl":"PRTL","is_amended":"N","obligation_id":"8","pin":"A012767201R"}'
echo ""
echo ""
echo "3. File TOT Return (Monthly):"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/file-return' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"kra_obligation_id":"8","returnPeriod":"01/10/2025 - 31/10/2025","returnType":"tot_return","tax_payer_pin":"A012767201R","gross_sales":100000,"tax_amount":3000,"filing_mode":"monthly"}'
echo ""
echo ""

# VAT User Test (NIL Return)
echo "=========================================="
echo "=== VAT USER: A004169589K ==="
echo "ID: 8841962 | YOB: 1967"
echo ""
echo "1. GUI Lookup:"
curl -s -X GET 'https://kratest.pesaflow.com/api/itax/gui-lookup?gui=8841962&tax_payer_type=KE' -H 'x-source-for: whatsapp'
echo ""
echo ""
echo "2. Filing Periods (VAT - obligation_id: 1):"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/obligation-filling-period' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"branch_id":"","from_date":"","from_itms_or_prtl":"PRTL","is_amended":"N","obligation_id":"1","pin":"A004169589K"}'
echo ""
echo ""
echo "3. File NIL Return (VAT):"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/file-return' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"kra_obligation_id":"1","returnPeriod":"01/12/2024 - 31/12/2024","returnType":"nil_return","tax_payer_pin":"A004169589K"}'
echo ""
echo ""

# PAYE User Test (NIL Return)
echo "=========================================="
echo "=== PAYE USER: A001188120G ==="
echo "ID: 3746839 | YOB: 1958"
echo ""
echo "1. GUI Lookup:"
curl -s -X GET 'https://kratest.pesaflow.com/api/itax/gui-lookup?gui=3746839&tax_payer_type=KE' -H 'x-source-for: whatsapp'
echo ""
echo ""
echo "2. Filing Periods (PAYE - obligation_id: 7):"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/obligation-filling-period' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"branch_id":"","from_date":"","from_itms_or_prtl":"PRTL","is_amended":"N","obligation_id":"7","pin":"A001188120G"}'
echo ""
echo ""
echo "3. File NIL Return (PAYE):"
curl -s -X POST 'https://kratest.pesaflow.com/api/ussd/file-return' \
  -H 'Content-Type: application/json' \
  -H 'x-forwarded-for: triple_2_ussd' \
  -d '{"kra_obligation_id":"7","returnPeriod":"01/12/2024 - 31/12/2024","returnType":"nil_return","tax_payer_pin":"A001188120G"}'
echo ""
echo ""

echo "=========================================="
echo "TEST COMPLETE"
echo "=========================================="
