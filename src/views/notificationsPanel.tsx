import { AuthProvider } from "@aha-app/aha-develop-react";
import React, { useEffect, useRef, useState } from "react";
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import { NotificationList } from "../components/NotificationList";
import { IDENTIFIER } from "../extension";
import { useGithubApi } from "../lib/useGithubApi";
import {
  authTokenState,
  loadingState,
  notificationsState,
  optionsState,
} from "../store/notifications";
import { listNotifications } from "../store/helpers/listNotifications";
import { PanelBar } from "./PanelBar";
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
  const lastModified = useRef<string | null>(null);
  const nextPollHandle = useRef<NodeJS.Timeout | null>(null);
  const [notifications, setNotifications] = useRecoilState(notificationsState);
  const setLoading = useSetRecoilState(loadingState);
  const setNotificationListOptions = useSetRecoilState(optionsState);

  useEffect(() => {
    return () => {
      if (nextPollHandle.current) clearTimeout(nextPollHandle.current);
    };
  }, []);

  useEffect(() => {
    setNotificationListOptions({ showRead, onlyParticipating });
  }, [showRead, onlyParticipating]);

  const { authed, error, fetchData } = useGithubApi(
    async (api) => {
      if (nextPollHandle.current) clearTimeout(nextPollHandle.current);
      setLoading(true);
      let pollSeconds = 60;

      try {
        const response = await listNotifications(
          api,
          {
            showRead,
            onlyParticipating,
          },
          lastModified.current
        );

        setNotifications(response.data);

        if (response.headers["last-modified"]) {
          lastModified.current = response.headers["last-modified"];
        }

        if (response.headers["x-poll-interval"]) {
          pollSeconds = Number(response.headers["x-poll-interval"]);
        }
      } catch (error) {
        if (error.status !== 304) {
          throw error;
        }
      }

      nextPollHandle.current = setTimeout(
        () => fetchData(),
        pollSeconds * 1000
      );
      setLoading(false);
    },
    [showRead, onlyParticipating]
  );

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

  if (!lastModified.current) {
    return <aha-spinner />;
  }

  return (
    <div className="notifications">
      <PanelBar onRefresh={fetchData} />
      <NotificationList notifications={notifications} />
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
