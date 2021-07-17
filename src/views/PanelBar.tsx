import React from "react";
import { useRecoilValue } from "recoil";
import { loadingState, unreadCountSelector } from "../store/notifications";

interface Props {
  onRefresh: () => void;
}

export const PanelBar: React.FC<Props> = ({ onRefresh }) => {
  const unreadCount = useRecoilValue(unreadCountSelector);
  const loading = useRecoilValue(loadingState);

  return (
    <div className="panel-bar">
      <aha-flex justify-content="space-between" align-items="center">
        <div style={{ flexGrow: 1 }}></div>

        <div className="title">{unreadCount} unread</div>

        <aha-flex
          justify-content="flex-end"
          style={{ flexGrow: 1, flexBasis: 0 }}
        >
          <aha-button type="unstyled" onClick={onRefresh} disabled={loading}>
            <aha-icon icon={`fa fa-sync ${loading ? "fa-spin" : ""}`} />
          </aha-button>
          <aha-button type="unstyled">
            <aha-icon icon="fa fa-eye" />
          </aha-button>
        </aha-flex>
      </aha-flex>
    </div>
  );
};
