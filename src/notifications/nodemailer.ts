import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.NOTIFICATION_USER || "ibrahim.task@outlook.com",
    pass: process.env.NOTIFICATION_PASS || "Password123456789"
  }

})
export const transporter2 = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NOTIFICATION_USER || "ibrahim.elheta@gmail.com",
    pass: process.env.NOTIFICATION_PASS || "Hema_123456789"
  }

})
export function sendRefuse(refusedMail: string, position: string, companyname: string) {
  return {
    from: "ibrahim.task@outlook.com",
    to: refusedMail,
    subject: `update on your application on ${position}`,
    text:
      `Thank you for your interest in the ${position} position at ${companyname} . Unfortunately, we will not be moving forward with your application, but we appreciate your time and interest in ${companyname}.
  `
  }
}
export function sendAccept(refusedMail: string, position: string, companyname: string) {
  return {
    from: "ibrahim.task@outlook.com",
    to: refusedMail,
    subject: `update on your application on ${position}`,
    text:
      `congratulation we would like to inform you that you are accepted in the ${position} position at ${companyname}.`
  }
}
export function sendSimilarity(refusedMail: string, position: string, companyname: string) {
  return {
    from: "ibrahim.task@outlook.com",
    to: refusedMail,
    subject: `new jobs for ${position}`,
    text:
      `there is a job matches your profile in ${companyname}.`
  }
}

