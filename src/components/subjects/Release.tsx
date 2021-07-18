import React from "react";
import { NotificationSubject } from "../Notification";

export const Release: NotificationSubject = ({ notification }) => {
  const { subject: release } = notification;

  return (
    <>
      <div className="title">
        <a href={aha.sanitizeUrl(release.url)}>Release {release.title}</a>
      </div>
    </>
  );
};
