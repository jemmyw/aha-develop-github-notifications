import React from "react";
import { NotificationSubject } from "./NotificationSubject";
import { webLink } from "../../lib/webLink";

function prUrlToNumber(url: string) {
  const parts = url.split("/");
  const [owner, repo, _, number] = parts.slice(-4);
  return `${owner}/${repo}#${number}`;
}

export const PullRequest: NotificationSubject = ({ notification }) => {
  const { subject: pullRequest } = notification;

  return (
    <div>
      <div className="title">
        <a href={webLink(pullRequest.url)}>{pullRequest.title}</a>
      </div>
      <div className="subtitle">
        <a href={webLink(pullRequest.url)}>{prUrlToNumber(pullRequest.url)}</a>
      </div>
    </div>
  );
};
