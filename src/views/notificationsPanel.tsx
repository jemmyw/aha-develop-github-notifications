import { AuthProvider } from "@aha-app/aha-develop-react";
import React, { useEffect, useMemo, useRef } from "react";
import {
  RecoilRoot,
  useRecoilCallback,
  useSetRecoilState,
  waitForAll,
} from "recoil";
import { NotificationList } from "../components/NotificationList";
import { PanelBar } from "../components/PanelBar";
import { IDENTIFIER } from "../extension";
import { useGithubApi } from "../lib/useGithubApi";
import { useIncrementPollId } from "../lib/useIncrementPollId";
import { useRecoilCachedLoadble } from "../lib/useRecoilCachedLoadable";
import { markAllRead } from "../store/helpers/markNotification";
import {
  authTokenState,
  lastModifiedSelector,
  nextPollAtSelector,
  notificationsSelector,
  optionsState,
} from "../store/notifications";
import { Styles } from "./Styles";

const panel = aha.getPanel(IDENTIFIER, "notificationsPanel", {
  name: "GitHub Notifications",
});

interface Props {
  showRead: boolean;
  onlyParticipating: boolean;
}

const NotificationsPanel: React.FC<Props> = ({
  showRead,
  onlyParticipating,
}) => {
  const nextPollHandle = useRef<NodeJS.Timeout | null>(null);
  const incrementPollId = useIncrementPollId();
  const setNotificationListOptions = useSetRecoilState(optionsState);
  const [[notifications, nextPollAt], notificationsState] =
    useRecoilCachedLoadble(
      waitForAll([notificationsSelector, nextPollAtSelector]),
      [[], null]
    );

  useEffect(() => {
    if (nextPollHandle.current) clearTimeout(nextPollHandle.current);

    if (nextPollAt) {
      const ms = nextPollAt.getTime() - Date.now();
      if (ms > 0) {
        console.log("setting timer for", ms);
        nextPollHandle.current = setTimeout(() => {
          incrementPollId();
        }, ms);
      }
    }

    return () => {
      if (nextPollHandle.current) clearTimeout(nextPollHandle.current);
    };
  }, [nextPollAt]);

  useEffect(() => {
    setNotificationListOptions({ showRead, onlyParticipating });
  }, [showRead, onlyParticipating]);

  const { authed, error, fetchData } = useGithubApi(async (api) => {
    return true;
  });

  const list = useMemo(
    () => <NotificationList notifications={notifications || []} />,
    [JSON.stringify(notifications)]
  );

  const onMarkRead = useRecoilCallback(({ snapshot }) => async () => {
    if (confirm("Are you sure you want to mark all notifications read?")) {
      const authToken = await snapshot.getPromise(authTokenState);
      if (!authToken) return;
      await markAllRead(authToken);
      incrementPollId(true);
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
      {list}
    </div>
  );
};

const isTrue = (val: unknown) =>
  (typeof val === "boolean" && val) ||
  (typeof val === "string" && val === "true");

panel.on("render", ({ props: { panel } }) => {
  const showRead = isTrue(panel.settings.showRead);
  const onlyParticipating = isTrue(panel.settings.onlyParticipating);

  return (
    <>
      <Styles />
      <AuthProvider serviceName="github" serviceParameters={{}}>
        <RecoilRoot>
          <NotificationsPanel
            showRead={showRead}
            onlyParticipating={onlyParticipating}
          />
        </RecoilRoot>
      </AuthProvider>
    </>
  );
});

panel.on({ action: "settings" }, () => {
  return [
    {
      key: "showRead",
      title: "Show read notifications",
      type: "Checkbox",
    },
    {
      key: "onlyParticipating",
      title: "Only participating",
      type: "Checkbox",
    },
  ];
});
