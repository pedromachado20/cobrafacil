import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "CobraFácil <onboarding@resend.dev>";

export async function sendInviteEmail(to: string, empresaNome: string, link: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Convite para participar de ${empresaNome} no CobraFácil`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #059669;">Você foi convidado!</h2>
        <p><strong>${empresaNome}</strong> convidou você para participar da equipe no CobraFácil.</p>
        <p style="margin: 24px 0;">
          <a href="${link}" style="background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Aceitar convite</a>
        </p>
        <p style="color: #64748b; font-size: 13px;">Se você não esperava este convite, pode ignorar este email.</p>
      </div>
    `,
  });
}
