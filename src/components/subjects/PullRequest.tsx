import React from "react";
import { useRecoilValue } from "recoil";
import { webLink } from "../../lib/webLink";
import { showLabelsState } from "../../store/display";
import { PullRequestEnhancement } from "../../store/helpers/listEnhancedPullRequests";
import { Labels } from "../Labels";
import { NotificationSubject } from "../Notification";

function prUrlToNumber(url: string) {
  const parts = url.split("/");
  const [owner, repo, _, number] = parts.slice(-4);
  return `${owner}/${repo}#${number}`;
}

const PullRequestState: React.FC<{ state: PullRequestEnhancement["state"] }> =
  ({ state }) => {
    const states = {
      OPEN: {
        backgroundColor: "#e5f3d6",
        color: "#4f8f0e",
      },
      MERGED: {
        color: "#564169",
        backgroundColor: "#e5dced",
      },
      CLOSED: {
        color: "#992e0b",
        backgroundColor: "#fae7e1",
      },
    };

    const style = { ...states[state] };

    return (
      <div
        style={{
          ...style,
          padding: "3px 5px 2px 5px",
          borderRadius: "10px",
          border: `1px solid ${style.color}`,
          fontWeight: "bold",
        }}
      >
        {state}
      </div>
    );
  };

export const PullRequest: NotificationSubject = ({
  notification,
  enhancements,
}) => {
  const showLabels = useRecoilValue(showLabelsState);
  const { subject: pullRequest } = notification;
  const enhancedPr = enhancements?.pullRequest;

  return (
    <aha-flex direction="column" gap="5px">
      <div>
        <div className="title">
          <a href={webLink(pullRequest.url)} target="_blank">
            {pullRequest.title}
          </a>
        </div>
        <aha-flex gap="5px" align-items="center">
          <div className="state" style={{ fontSize: "10px" }}>
            {enhancedPr && <PullRequestState state={enhancedPr.state} />}
          </div>
          <div className="subtitle">
            <a href={webLink(pullRequest.url)} target="_blank">
              {prUrlToNumber(pullRequest.url)}
            </a>
          </div>
        </aha-flex>
      </div>
      {showLabels && enhancedPr && <Labels labels={enhancedPr.labels.nodes} />}
    </aha-flex>
  );
};
