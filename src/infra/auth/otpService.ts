export async function sendOtp(phone: string): Promise<string> {
  const otp = '123456'; // dev only
  console.log(`OTP for ${phone}: ${otp}`);
  return otp;
}

export function verifyOtp(input: string, actual: string): boolean {
  return input === actual;
}

