import { AuthProvider } from "@aha-app/aha-develop-react";
import React from "react";
import { RecoilRoot } from "recoil";
import { NotificationsPanel } from "../components/NotificationsPanel";
import { IDENTIFIER } from "../extension";
import { Styles } from "./Styles";
import createCache from "@emotion/cache";
import { NonceProvider } from "react-select";
class MyNonceProvider extends NonceProvider {
  createEmotionCache = (nonce) => {
    return createCache({ nonce, container: this.props.container });
  };
}

const panel = aha.getPanel(IDENTIFIER, "notificationsPanel", {
  name: "GitHub Notifications",
});

const isTrue = (val: unknown) =>
  (typeof val === "boolean" && val) ||
  (typeof val === "string" && val === "true");

panel.on("render", ({ props: { panel }, container }) => {
  const showRead = isTrue(panel.settings.showRead);
  const onlyParticipating = isTrue(panel.settings.onlyParticipating);
  const showLabels = isTrue(panel.settings.showLabels);

  return (
    <>
      <MyNonceProvider container={container}>
        <Styles />
        <AuthProvider serviceName="github" serviceParameters={{}}>
          <RecoilRoot>
            <NotificationsPanel
              showRead={showRead}
              onlyParticipating={onlyParticipating}
              showLabels={showLabels}
            />
          </RecoilRoot>
        </AuthProvider>
      </MyNonceProvider>
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
    {
      key: "showLabels",
      title: "Show labels",
      type: "Checkbox",
    },
  ];
});
