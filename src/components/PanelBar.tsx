import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useRecoilCachedLoadable } from "../lib/useRecoilCachedLoadable";
import {
  filterActiveSelector,
  filteredUnreadCountSelector,
  showFilterAtom,
} from "../store/filters";
import { loadingState } from "../store/notifications";

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
  const [unreadCount] = useRecoilCachedLoadable(filteredUnreadCountSelector, 0);
  const loading = useRecoilValue(loadingState);
  const setShowFilter = useSetRecoilState(showFilterAtom);
  const filterActive = useRecoilValue(filterActiveSelector);

  const onShowFilter = () => {
    setShowFilter((t) => !t);
  };

  return (
    <div className="panel-bar">
      <aha-flex justify-content="space-between" align-items="center">
        <div style={{ flexGrow: 1 }}></div>

        <div className="title">{unreadCount} unread</div>

        <aha-flex
          justify-content="flex-end"
          style={{ flexGrow: 1, flexBasis: 0 }}
        >
          <aha-button-group>
            <aha-button onClick={onRefresh}>
              <Spinner icon="sync" spin={loading} />
            </aha-button>
            <aha-button onClick={onMarkRead}>
              <aha-icon icon="fa fa-eye" />
            </aha-button>
            <aha-button
              onClick={onShowFilter}
              kind={filterActive ? "secondary" : "default"}
            >
              <aha-icon icon="fa fa-filter" />
            </aha-button>
          </aha-button-group>
        </aha-flex>
      </aha-flex>
    </div>
  );
};
