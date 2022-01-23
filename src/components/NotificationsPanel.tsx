import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { NotificationList } from "../components/NotificationList";
import { PanelBar } from "../components/PanelBar";
import { useGithubApi } from "../lib/useGithubApi";
import { useIncrementPollId } from "../lib/useIncrementPollId";
import { usePropSync } from "../lib/usePropSync";
import { useRecoilCachedLoadable } from "../lib/useRecoilCachedLoadable";
import { showLabelsState } from "../store/display";
import {
  filteredNotificationsSelector,
  showFilterAtom,
} from "../store/filters";
import { nextPollAtSelector, optionsState } from "../store/notifications";
import { useMarkListRead } from "../store/read";
import { Filters } from "./Filters";

interface Props {
  showRead: boolean;
  onlyParticipating: boolean;
  showLabels: boolean;
}

const useSetTimeout = (
  callback: () => void,
  runAt: Date | undefined | null
) => {
  const nextPollHandle = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (nextPollHandle.current) clearTimeout(nextPollHandle.current);
    if (!runAt) return;

    const ms = runAt.getTime() - Date.now();
    if (ms <= 0) return;

    nextPollHandle.current = setTimeout(() => {
      callback();
    }, ms);
    return () => {
      if (nextPollHandle.current) clearTimeout(nextPollHandle.current);
    };
  }, [runAt]);
};

export const NotificationsPanel: React.FC<Props> = ({
  showRead,
  onlyParticipating,
  showLabels,
}) => {
  const nextPollHandle = useRef<NodeJS.Timeout | null>(null);
  const showFilters = useRecoilValue(showFilterAtom);
  const incrementPollId = useIncrementPollId();
  const [nextPollAt] = useRecoilCachedLoadable(nextPollAtSelector, null);
  const markListRead = useMarkListRead();

  useSetTimeout(() => incrementPollId(), nextPollAt);

  usePropSync({ showRead, onlyParticipating }, optionsState, [
    showRead,
    onlyParticipating,
  ]);
  usePropSync(showLabels, showLabelsState, [showLabels]);

  const { authed, error, fetchData } = useGithubApi(async (api) => {
    return true;
  });

  const list = useMemo(() => <NotificationList />, [showLabels]);

  const onMarkRead = useRecoilCallback(({ snapshot }) => async () => {
    if (confirm("Are you sure you want to mark all notifications read?")) {
      const notifications = await snapshot.getPromise(
        filteredNotificationsSelector
      );
      await markListRead(notifications.map((n) => n.notification));
    }
  });

  if (error) {
    return (
      <aha-flex>
        <span>
          <aha-icon icon="fa fa-error" />
          Error: {error}
        </span>
      </aha-flex>
    );
  }

  if (!authed) {
    return (
      <aha-flex>
        <aha-button type="primary" onClick={fetchData}>
          Authenticate
        </aha-button>
      </aha-flex>
    );
  }

  return (
    <div className="notifications">
      <PanelBar
        onRefresh={() => incrementPollId(true)}
        onMarkRead={() => onMarkRead()}
      />
      <React.Suspense fallback={<aha-spinner />}>
        {showFilters ? <Filters /> : list}
      </React.Suspense>
    </div>
  );
};
