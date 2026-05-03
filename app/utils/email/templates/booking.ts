export function bookingTemplate({
  fullName,
  court,
  date,
  time,
}: {
  fullName: string
  court: string
  date: string
  time: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="color: #1a2e10;">Booking Confirmed!</h2>
      <p style="color: #4a5e3a;">Hi ${fullName}, your court has been booked successfully.</p>
      <div style="background: #f0f4ee; padding: 24px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0;"><strong>Court:</strong> ${court}</p>
        <p style="margin: 8px 0 0;"><strong>Date:</strong> ${date}</p>
        <p style="margin: 8px 0 0;"><strong>Time:</strong> ${time}</p>
      </div>
      <p style="color: #888; font-size: 12px;">Thank you for using CourtBook!</p>
    </div>
  `
}