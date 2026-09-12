/**
 * Nodemailer transporter singleton + email templates.
 * Configure via environment variables in .env:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM
 */
import nodemailer from "nodemailer";
import type { HackDoneEntry } from "./hack-done-store";
import type { VoucherConfirmationEntry } from "./voucher-confirmation-store";

// ─── Transporter ──────────────────────────────────────────────────────────────

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

const globalForMailer = globalThis as unknown as {
  mailer?: ReturnType<typeof createTransporter>;
};

export function getTransporter() {
  if (!globalForMailer.mailer) {
    globalForMailer.mailer = createTransporter();
  }
  return globalForMailer.mailer;
}

const FROM = process.env.SMTP_FROM || "DarkWeb Admin <noreply@example.com>";

// ─── Hack Done Email ──────────────────────────────────────────────────────────

export async function sendHackDoneReceiptEmail(entry: HackDoneEntry): Promise<void> {
  const formattedDate = new Date(entry.submittedAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hack Session Receipt</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Courier New',monospace;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111118;border:1px solid #1e1e2e;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:32px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c4b5fd;margin-bottom:8px;">Session Finalized</p>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Hack Session Completed</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 24px;color:#94a3b8;font-size:13px;line-height:1.6;">
                Your hack session has been successfully finalized and recorded. Below is your session receipt.
              </p>

              <!-- Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #1e1e2e;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Email Address</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#e2e8f0;">${entry.email}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Voucher Code</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#a78bfa;font-weight:700;letter-spacing:2px;">${entry.voucherCode}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Generated Code</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#e2e8f0;font-weight:600;">${entry.generatedCode}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Loader Code</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#e2e8f0;font-weight:600;">${entry.loaderCode}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Status</p>
                    <p style="margin:4px 0 0;font-size:13px;color:${entry.status === "verified" ? "#34d399" : "#fbbf24"};font-weight:600;text-transform:uppercase;">${entry.status}</p>
                  </td>
                </tr>
                ${entry.remarks ? `
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Admin Remarks</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">${entry.remarks}</p>
                  </td>
                </tr>` : ""}
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Submitted At</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#64748b;">${formattedDate}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#475569;line-height:1.6;">
                This is an automated receipt for your records. If you did not initiate this session, please disregard this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #1e1e2e;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#334155;">Session ID: ${entry.id}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  await getTransporter().sendMail({
    from: FROM,
    to: entry.email,
    subject: "Your Hack Session Receipt — Session Finalized",
    html,
    text: `Hack Session Receipt\n\nEmail: ${entry.email}\nVoucher Code: ${entry.voucherCode}\nGenerated Code: ${entry.generatedCode}\nLoader Code: ${entry.loaderCode}\nStatus: ${entry.status}\n${entry.remarks ? `Remarks: ${entry.remarks}\n` : ""}Submitted: ${formattedDate}\n\nSession ID: ${entry.id}`,
  });
}

// ─── Voucher Confirmation Email ───────────────────────────────────────────────

export async function sendVoucherConfirmationReceiptEmail(
  entry: VoucherConfirmationEntry
): Promise<void> {
  const formattedDate = new Date(entry.submittedAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Voucher Confirmation Receipt</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Courier New',monospace;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#111118;border:1px solid #1e1e2e;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#d97706,#b45309);padding:32px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#fde68a;margin-bottom:8px;">Validated</p>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Voucher Confirmed</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 24px;color:#94a3b8;font-size:13px;line-height:1.6;">
                Your voucher confirmation has been successfully processed. Here is your detailed receipt.
              </p>

              <!-- Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #1e1e2e;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Email Address</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#e2e8f0;">${entry.email}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Voucher Code</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#fbbf24;font-weight:700;letter-spacing:2px;">${entry.voucherCode}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Voucher Type</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#e2e8f0;font-weight:600;">${entry.voucherType}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Voucher Value</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#fbbf24;font-weight:700;">${entry.voucherValue}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Status</p>
                    <p style="margin:4px 0 0;font-size:13px;color:${entry.status === "verified" ? "#34d399" : "#fbbf24"};font-weight:600;text-transform:uppercase;">${entry.status}</p>
                  </td>
                </tr>
                ${entry.remarks ? `
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Admin Remarks</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">${entry.remarks}</p>
                  </td>
                </tr>` : ""}
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:2px;">Submitted At</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#64748b;">${formattedDate}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#475569;line-height:1.6;">
                This is an automated receipt for your records. If you did not request this confirmation, please disregard this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #1e1e2e;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#334155;">Confirmation ID: ${entry.id}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  await getTransporter().sendMail({
    from: FROM,
    to: entry.email,
    subject: "Your Voucher Confirmation Receipt",
    html,
    text: `Voucher Confirmation Receipt\n\nEmail: ${entry.email}\nVoucher Code: ${entry.voucherCode}\nVoucher Type: ${entry.voucherType}\nVoucher Value: ${entry.voucherValue}\nStatus: ${entry.status}\n${entry.remarks ? `Remarks: ${entry.remarks}\n` : ""}Submitted: ${formattedDate}\n\nConfirmation ID: ${entry.id}`,
  });
}
