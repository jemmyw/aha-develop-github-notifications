import React from "react";
import { useRecoilValue } from "recoil";
import { webLink } from "../../lib/webLink";
import { showLabelsState } from "../../store/display";
import {
  PullRequestEnhancement,
  PULL_REQUEST_STATES,
} from "../../store/helpers/listEnhancedPullRequests";
import { Labels } from "../Labels";
import { NotificationSubject } from "../Notification";

function prUrlToNumber(url: string) {
  const parts = url.split("/");
  const [owner, repo, _, number] = parts.slice(-4);
  return `${owner}/${repo}#${number}`;
}

const PullRequestState: React.FC<{
  state: PullRequestEnhancement["state"];
}> = ({ state }) => {
  const states = PULL_REQUEST_STATES;
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

export const PullRequest: NotificationSubject = ({ enhanced, onVisit }) => {
  const { notification } = enhanced;
  const showLabels = useRecoilValue(showLabelsState);
  const { subject: pullRequest } = notification;
  const enhancedPr = enhanced.pullRequest;

  return (
    <aha-flex direction="column" gap="5px">
      <div>
        <div className="title">
          <a href={webLink(pullRequest.url)} target="_blank" onClick={onVisit}>
            {pullRequest.title}
          </a>
        </div>
        <aha-flex gap="5px" align-items="center">
          <div className="state" style={{ fontSize: "10px" }}>
            {enhancedPr && <PullRequestState state={enhancedPr.state} />}
          </div>
          <div className="subtitle">
            <a
              href={webLink(pullRequest.url)}
              target="_blank"
              onClick={onVisit}
            >
              {prUrlToNumber(pullRequest.url)}
            </a>
          </div>
        </aha-flex>
      </div>
      {showLabels && enhancedPr && <Labels labels={enhancedPr.labels.nodes} />}
    </aha-flex>
  );
};
