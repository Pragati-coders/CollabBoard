import * as React from "react";

interface CommentMentionProps {
  recipientName: string;
  mentionerName: string;
  cardTitle: string;
  commentText: string;
  cardUrl: string;
}

export function CommentMentionEmail({ recipientName, mentionerName, cardTitle, commentText, cardUrl }: CommentMentionProps) {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #09090b; color: #fafafa; margin: 0; }
          .container { max-width: 560px; margin: 40px auto; padding: 40px; background: #18181b; border-radius: 12px; border: 1px solid #27272a; }
          .comment-box { background: #27272a; border-radius: 8px; padding: 16px; margin: 20px 0; font-style: italic; color: #d4d4d8; }
          .button { display: inline-block; background: #7c3aed; color: #fff !important; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; }
          p { color: #a1a1aa; line-height: 1.6; margin: 0 0 16px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h2 style={{ margin: "0 0 20px", fontSize: 20 }}>💬 You were mentioned</h2>
          <p>Hi <strong style={{ color: "#fafafa" }}>{recipientName}</strong>,</p>
          <p><strong style={{ color: "#fafafa" }}>{mentionerName}</strong> mentioned you in a comment on <strong style={{ color: "#fafafa" }}>{cardTitle}</strong>:</p>
          <div className="comment-box">&quot;{commentText}&quot;</div>
          <a href={cardUrl} className="button">View Comment</a>
          <p style={{ fontSize: 12, marginTop: 24, color: "#52525b" }}>© 2026 CollabBoard</p>
        </div>
      </body>
    </html>
  );
}
