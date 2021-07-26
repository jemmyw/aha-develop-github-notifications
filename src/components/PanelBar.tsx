import React, { useEffect, useState } from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { useRecoilCachedLoadable } from "../lib/useRecoilCachedLoadable";
import { loadingState, unreadCountSelector } from "../store/notifications";

interface Props {
  onRefresh: () => void;
  onMarkRead: () => void;
}

const Spinner: React.FC<{ icon: string; spin: boolean }> = ({ icon, spin }) => {
  const [showSpin, setShowSpin] = useState(spin);

  useEffect(() => {
    if (spin && !showSpin) setShowSpin(true);
  });

  const handleSpinIteration = () => {
    if (spin) return;
    setShowSpin(false);
  };

  return (
    <i
      className={`fa fa-${icon} ${showSpin ? "fa-spin" : ""}`}
      onAnimationIteration={() => handleSpinIteration()}
    />
  );
};

export const PanelBar: React.FC<Props> = ({ onRefresh, onMarkRead }) => {
  const [unreadCount] = useRecoilCachedLoadable(unreadCountSelector, 0);
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
            <Spinner icon="sync" spin={loading} />
          </aha-button>
          <aha-button type="unstyled" onClick={onMarkRead}>
            <aha-icon icon="fa fa-eye" />
          </aha-button>
        </aha-flex>
      </aha-flex>
    </div>
  );
};
