import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import type { UserNotificationType } from "@/types/notifications";

interface NotifyUserParams {
  userId: string;
  email?: string | null;
  type: UserNotificationType;
  title: string;
  message: string;
  link?: string;
  sendEmailNotification?: boolean;
}

export async function notifyUser(params: NotifyUserParams): Promise<void> {
  try {
    const admin = await createAdminClient();

    let emailSent = false;
    if (params.sendEmailNotification !== false && params.email) {
      const appOrigin =
        process.env.NEXT_PUBLIC_APP_ORIGIN || "https://app.afiliantkafaceless.pl";
      const linkUrl = params.link
        ? params.link.startsWith("http")
          ? params.link
          : `${appOrigin}${params.link}`
        : appOrigin;

      emailSent = await sendEmail({
        to: params.email,
        subject: params.title,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="color:#0f766e;margin:0 0 16px">${params.title}</h2>
            <p style="color:#334155;line-height:1.6">${params.message}</p>
            ${
              params.link
                ? `<p style="margin-top:24px"><a href="${linkUrl}" style="background:#0d9488;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">Otwórz w panelu</a></p>`
                : ""
            }
          </div>
        `,
      });
    }

    await admin.from("user_notifications").insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link || null,
      email_sent: emailSent,
    });
  } catch {
    // Notifications must not break main flows
  }
}

export async function notifyAllActiveUsers(params: {
  type: UserNotificationType;
  title: string;
  message: string;
  link?: string;
  sendEmail?: boolean;
}): Promise<number> {
  try {
    const admin = await createAdminClient();
    const { data: usersData } = await admin.auth.admin.listUsers({
      perPage: 1000,
    });
    const users = usersData?.users || [];

    let count = 0;
    for (const user of users) {
      await notifyUser({
        userId: user.id,
        email: user.email,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        sendEmailNotification: params.sendEmail,
      });
      count++;
    }
    return count;
  } catch {
    return 0;
  }
}
