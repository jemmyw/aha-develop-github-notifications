import React from "react";
import { NotificationSubject } from "./NotificationSubject";

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
