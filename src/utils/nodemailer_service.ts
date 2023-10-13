import nodemailer from 'nodemailer'

export const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  html: string
): Promise<[boolean, string]> => {
  try {
    // We define the transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
      }
    })
    // We define the email options
    const mailOptions = {
      from,
      to,
      subject,
      html
    }

    // We send the email
    await transporter.sendMail(mailOptions)
    return [true, '']
  } catch (e) {
    console.error(e)
    return [false, (e as Error).message]
  }
}
