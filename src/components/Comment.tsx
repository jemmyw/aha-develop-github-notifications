import React from "react";
import ReactMarkdown from "react-markdown";
import { RequiredComment } from "./Notification";
import { Avatar } from "./Avatar";

export const Comment: React.FC<{ comment: RequiredComment }> = ({
  comment,
}) => {
  return (
    <div className="comment">
      <aha-flex>
        <div className="comment-avatar">
          {comment.user?.avatar_url && (
            <Avatar src={comment.user.avatar_url} size={22} />
          )}
        </div>
        <div className="comment-content">
          <ReactMarkdown>{comment.body}</ReactMarkdown>
        </div>
      </aha-flex>
    </div>
  );
};
