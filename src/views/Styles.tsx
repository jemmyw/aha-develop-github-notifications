import React from "react";

function css(literals: TemplateStringsArray) {
  const values = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    values[_i - 1] = arguments[_i];
  }
  let output = "";
  let index;
  for (index = 0; index < values.length; index++) {
    output += literals[index] + values[index];
  }
  output += literals[index];
  return output;
}

export const Styles = () => {
  return (
    <style>
      {css`
        .panel-bar {
          background-color: var(--theme-secondary-background);
        }

        .panel-bar .fa-spin {
          color: var(--theme-tertiary-text);
        }

        .notification-list.empty {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 20px;
          text-align: center;
        }

        .notification.read .mark {
          color: var(--aha-gray-400);
        }

        .notification.unread .mark {
          color: var(--aha-blue-400);
        }

        .notification.fade {
          opacity: 0.7;
        }

        .notification .mark {
          font-size: 10px;
          cursor: pointer;
        }

        .notification {
          border-top: 1px solid var(--theme-primary-background);
          border-bottom: 1px solid var(--theme-secondary-border);
          background: var(--theme-secondary-background);
          padding: 8px;
        }

        .notification .title a {
          color: inherit;
        }

        .notification.unread .title a {
          font-weight: bold;
        }

        .notification .right-info {
          color: var(--theme-secondary-text);
        }

        .notification .comment {
          margin-left: 10px;
        }

        .notification .comment-content {
          padding: 5px;
        }

        .notification .comment-content blockquote {
          border-left: 3px solid var(--theme-tertiary-border);
          margin-left: 5px;
          padding-left: 10px;
        }

        .select__menu {
          position: relative !important;
        }
      `}
    </style>
  );
};
