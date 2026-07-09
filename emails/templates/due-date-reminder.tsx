import * as React from "react";

interface DueDateReminderProps {
  userName: string;
  cardTitle: string;
  boardName: string;
  dueDate: string;
  cardUrl: string;
}

export function DueDateReminderEmail({ userName, cardTitle, boardName, dueDate, cardUrl }: DueDateReminderProps) {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #09090b; color: #fafafa; margin: 0; }
          .container { max-width: 560px; margin: 40px auto; padding: 40px; background: #18181b; border-radius: 12px; border: 1px solid #27272a; }
          .alert { background: #f59e0b20; border: 1px solid #f59e0b40; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .button { display: inline-block; background: #7c3aed; color: #fff !important; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; text-decoration: none; }
          p { color: #a1a1aa; line-height: 1.6; margin: 0 0 16px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h2 style={{ margin: "0 0 20px", fontSize: 20 }}>⏰ Task Due Tomorrow</h2>
          <p>Hi <strong style={{ color: "#fafafa" }}>{userName}</strong>,</p>
          <p>This is a reminder that the following task is due tomorrow:</p>
          <div className="alert">
            <strong style={{ color: "#fafafa", display: "block", marginBottom: 6 }}>{cardTitle}</strong>
            <span style={{ fontSize: 13, color: "#a1a1aa" }}>Board: {boardName}</span><br />
            <span style={{ fontSize: 13, color: "#f59e0b" }}>Due: {dueDate}</span>
          </div>
          <a href={cardUrl} className="button">View Task</a>
          <p style={{ fontSize: 12, marginTop: 24, color: "#52525b" }}>© 2026 CollabBoard</p>
        </div>
      </body>
    </html>
  );
}
