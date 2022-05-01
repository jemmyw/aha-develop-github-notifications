import React from "react";
import { NotificationSubject } from "../Notification";

export const Release: NotificationSubject = ({ enhanced, onVisit }) => {
  const { notification } = enhanced;
  const { subject: release } = notification;

  return (
    <>
      <div className="title">
        <a href={aha.sanitizeUrl(release.url)} onClick={onVisit}>
          Release {release.title}
        </a>
      </div>
    </>
  );
};
