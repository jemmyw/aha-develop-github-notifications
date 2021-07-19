import React from "react";
import { webLink } from "../../lib/webLink";
import { Labels } from "../Labels";
import { NotificationSubject } from "../Notification";

function prUrlToNumber(url: string) {
  const parts = url.split("/");
  const [owner, repo, _, number] = parts.slice(-4);
  return `${owner}/${repo}#${number}`;
}

export const PullRequest: NotificationSubject = ({
  notification,
  enhancements,
}) => {
  const { subject: pullRequest } = notification;
  const enhancedPr = enhancements?.pullRequest;

  return (
    <aha-flex direction="column" gap="5px">
      <div>
        <div className="title">
          <a href={webLink(pullRequest.url)}>{pullRequest.title}</a>
        </div>
        <div className="subtitle">
          <a href={webLink(pullRequest.url)}>
            {prUrlToNumber(pullRequest.url)}
          </a>
        </div>
      </div>
      {enhancedPr && <Labels labels={enhancedPr.labels.nodes} />}
    </aha-flex>
  );
};
