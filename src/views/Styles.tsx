import React from "react";

export const Styles = () => {
  return (
    <style>
      {`
    .panel-bar {
      background-color: var(--aha-gray-200);
    }

    .panel-bar .title {
    }

    .notification.read .mark {
      visibility: hidden;
    }

    .notification .mark {
      color: var(--aha-blue-400);
      font-size: 8px;
    }

    .notification {
      border-top: 1px solid white;
      border-bottom: 1px solid var(--aha-gray-200);
      background: var(--aha-gray-100);
    }
    `}
    </style>
  );
};
