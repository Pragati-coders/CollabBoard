import * as React from "react";

interface InvitationEmailProps {
  inviterName: string;
  workspaceName: string;
  inviteUrl: string;
  recipientEmail: string;
}

export function InvitationEmail({ inviterName, workspaceName, inviteUrl, recipientEmail }: InvitationEmailProps) {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #09090b; color: #fafafa; margin: 0; padding: 0; }
          .container { max-width: 560px; margin: 40px auto; padding: 40px; background: #18181b; border-radius: 12px; border: 1px solid #27272a; }
          .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; }
          .logo-box { width: 36px; height: 36px; background: #7c3aed; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
          h1 { font-size: 22px; font-weight: 700; margin: 0 0 12px; }
          p { font-size: 15px; color: #a1a1aa; line-height: 1.6; margin: 0 0 16px; }
          .button { display: inline-block; background: #7c3aed; color: #fff !important; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; text-decoration: none; margin: 8px 0 24px; }
          .footer { font-size: 12px; color: #52525b; border-top: 1px solid #27272a; padding-top: 20px; margin-top: 32px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="logo">
            <div className="logo-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 18 }}>CollabBoard</span>
          </div>

          <h1>You've been invited! 🎉</h1>
          <p>
            <strong style={{ color: "#fafafa" }}>{inviterName}</strong> has invited you to join the{" "}
            <strong style={{ color: "#fafafa" }}>{workspaceName}</strong> workspace on CollabBoard.
          </p>
          <p>CollabBoard is the modern project management platform for high-performing teams.</p>

          <a href={inviteUrl} className="button">
            Accept Invitation
          </a>

          <p style={{ fontSize: 13 }}>
            Or copy and paste this URL into your browser:<br />
            <span style={{ color: "#7c3aed", wordBreak: "break-all" }}>{inviteUrl}</span>
          </p>

          <div className="footer">
            <p>This invitation was sent to {recipientEmail}. If you weren't expecting this, you can ignore this email.</p>
            <p>© 2026 CollabBoard. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
