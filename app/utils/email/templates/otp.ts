export function otpTemplate(code: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #1a2e10;">Verify your email</h2>
      <p style="color: #4a5e3a;">Use the code below to verify your email address. It expires in 10 minutes.</p>
      <div style="
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #1a2e10;
        background: #f0f4ee;
        padding: 24px;
        border-radius: 8px;
        text-align: center;
        margin: 24px 0;
      ">
        ${code}
      </div>
      <p style="color: #888; font-size: 12px;">If you didn't request this, ignore this email.</p>
    </div>
  `
}