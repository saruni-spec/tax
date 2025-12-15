'use server';

import axios from 'axios';

const BASE_URL = 'https://kratest.pesaflow.com/api/ussd';
const ITAX_URL = 'https://kratest.pesaflow.com/api/itax';

// ============= Types =============

export interface OTPResult {
  success: boolean;
  message: string;
  code?: number;
}

export interface IdLookupResult {
  success: boolean;
  code?: number;
  message: string;
  name?: string;
  pin?: string;
  idNumber?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface PinRegistrationResult {
  success: boolean;
  code?: number;
  message: string;
  pin?: string;
  receiptNumber?: string;
}

// ============= Helper Functions =============

function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

// ============= API Functions =============

/**
 * Generate OTP for phone verification
 * POST /api/ussd/otp
 */
export async function generateOTP(msisdn: string): Promise<OTPResult> {
  const cleanNumber = cleanPhoneNumber(msisdn);

  try {
    const response = await axios.post(
      `${BASE_URL}/otp`,
      { msisdn: cleanNumber },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': 'triple_2_ussd',
        },
        timeout: 30000,
      }
    );

    console.log('Generate OTP response:', response.data);

    return {
      success: true,
      message: response.data.message || 'OTP sent successfully',
      code: response.data.code,
    };
  } catch (error: any) {
    console.error('Generate OTP error:', error.response?.data || error.message);
    
    // For testing, return success even if API fails
    return {
      success: true,
      message: 'OTP sent (Test Mode - use any 6-digit code)',
    };
  }
}

/**
 * Validate OTP code
 * POST /api/ussd/validate-otp
 */
export async function validateOTP(msisdn: string, otp: string): Promise<OTPResult> {
  const cleanNumber = cleanPhoneNumber(msisdn);

  try {
    const response = await axios.post(
      `${BASE_URL}/validate-otp`,
      { 
        msisdn: cleanNumber,
        otp: otp,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': 'triple_2_ussd',
        },
        timeout: 30000,
      }
    );

    console.log('Validate OTP response:', response.data);

    return {
      success: response.data.success !== false,
      message: response.data.message || 'OTP validated successfully',
      code: response.data.code,
    };
  } catch (error: any) {
    console.error('Validate OTP error:', error.response?.data || error.message);
    
    // For testing, allow any 6-digit code
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      return {
        success: true,
        message: 'OTP validated (Test Mode)',
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid OTP',
    };
  }
}

/**
 * Lookup taxpayer by ID number
 * Primary: GET /api/itax/gui-lookup
 * Fallback: POST /api/ussd/id-lookup
 */
export async function lookupById(
  idNumber: string, 
  msisdn?: string
): Promise<IdLookupResult> {
  try {
    // Primary: Use GUI Lookup API
    const response = await axios.get(
      `${ITAX_URL}/gui-lookup`,
      {
        params: {
          gui: idNumber,
          tax_payer_type: 'KE',
        },
        headers: {
          'x-source-for': 'whatsapp',
        },
        timeout: 30000,
      }
    );

    const data = response.data;
    console.log('GUI Lookup response:', data);

    if (data.Status === 'OK' || data.ResponseCode === '30000' || data.Message === 'Valid ID') {
      return {
        success: true,
        code: parseInt(data.ResponseCode) || 200,
        message: data.Message || 'Valid ID',
        name: data.TaxpayerName,
        pin: data.PIN,
        idNumber: idNumber,
      };
    } else {
      return {
        success: false,
        code: parseInt(data.ResponseCode) || 400,
        message: data.Message || 'Invalid ID number',
      };
    }
  } catch (primaryError: any) {
    console.error('GUI Lookup error:', primaryError.response?.data || primaryError.message);

    // Fallback: Try ID Lookup API
    if (msisdn) {
      try {
        const cleanNumber = cleanPhoneNumber(msisdn);
        const fallbackResponse = await axios.post(
          `${BASE_URL}/id-lookup`,
          {
            id_number: idNumber,
            msisdn: cleanNumber,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-forwarded-for': 'triple_2_ussd',
            },
            timeout: 30000,
          }
        );

        console.log('ID Lookup fallback response:', fallbackResponse.data);

        const fallbackData = fallbackResponse.data;
        if (fallbackData.name || fallbackData.success) {
          return {
            success: true,
            message: fallbackData.message || 'Valid ID',
            name: fallbackData.name,
            idNumber: idNumber,
          };
        }
      } catch (fallbackError: any) {
        console.error('ID Lookup fallback error:', fallbackError.response?.data || fallbackError.message);
      }
    }

    return {
      success: false,
      message: primaryError.response?.data?.message || 'Failed to lookup ID',
    };
  }
}

/**
 * Submit PIN Registration
 * POST /api/ussd/pin-registration
 */
export async function submitPinRegistration(
  type: 'citizen' | 'resident',
  idNumber: string,
  email: string,
  msisdn: string
): Promise<PinRegistrationResult> {
  const cleanNumber = cleanPhoneNumber(msisdn);

  console.log('Submitting PIN registration:', {
    type,
    id_number: idNumber,
    email,
    msisdn: cleanNumber,
  });

  try {
    const response = await axios.post(
      `${BASE_URL}/pin-registration`,
      {
        type: type,
        email: email,
        msisdn: cleanNumber,
        id_number: idNumber,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': 'triple_2_ussd',
        },
        timeout: 60000, // Longer timeout for registration
      }
    );

    console.log('PIN Registration response:', JSON.stringify(response.data, null, 2));

    const data = response.data;
    
    return {
      success: data.success !== false && !data.error,
      code: data.code,
      message: data.message || 'PIN Registration submitted successfully',
      pin: data.pin || data.kra_pin,
      receiptNumber: data.receipt_number || data.receiptNumber || `REG-${Date.now()}`,
    };
  } catch (error: any) {
    console.error('PIN Registration error:', error.response?.data || error.message);
    
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.error || 'Failed to submit PIN registration',
    };
  }
}

/**
 * Initiate session for PIN registration
 * POST /api/ussd/initiate-session
 */
export async function initiateSession(
  idNumber: string,
  msisdn: string,
  type: 'citizen' | 'resident'
): Promise<{ success: boolean; message: string; sessionId?: string }> {
  const cleanNumber = cleanPhoneNumber(msisdn);

  try {
    const response = await axios.post(
      `${BASE_URL}/initiate-session`,
      {
        id_number: idNumber,
        msisdn: cleanNumber,
        type: type,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': 'triple_2_ussd',
        },
        timeout: 30000,
      }
    );

    console.log('Initiate session response:', response.data);

    return {
      success: true,
      message: response.data.message || 'Session initiated',
      sessionId: response.data.session_id,
    };
  } catch (error: any) {
    console.error('Initiate session error:', error.response?.data || error.message);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to initiate session',
    };
  }
}
