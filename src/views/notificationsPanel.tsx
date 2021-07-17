import { AuthProvider } from "@aha-app/aha-develop-react";
import { Octokit } from "@octokit/rest";
import React, { useRef, useState } from "react";
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import { NotificationList } from "../components/NotificationList";
import { IDENTIFIER } from "../extension";
import { useGithubApi } from "../lib/useGithubApi";
import { loadingState, notificationsState } from "../store/notifications";
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
  const [notifications, setNotifications] = useRecoilState(notificationsState);
  const setLoading = useSetRecoilState(loadingState);

  const { authed, error, fetchData } = useGithubApi(
    async (api) => {
      setLoading(true);

      try {
        const response = await listNotifications(api, {
          showRead,
          onlyParticipating,
          lastModified: lastModified.current,
        });

        setNotifications(response.data);

        if (response.headers["last-modified"]) {
          lastModified.current = response.headers["last-modified"];
        }
      } catch (error) {
        if (error.status !== 304) {
          throw error;
        }
      }

      setLoading(false);
      return true;
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

async function listNotifications(
  api: Octokit,
  {
    showRead,
    onlyParticipating,
    lastModified,
  }: {
    showRead: boolean;
    onlyParticipating: boolean;
    lastModified: string | null;
  }
) {
  const headers = {};

  if (lastModified) {
    headers["If-Modified-Since"] = lastModified;
  }

  return await api.rest.activity.listNotificationsForAuthenticatedUser({
    all: showRead,
    participating: onlyParticipating,
    headers,
  });
}
