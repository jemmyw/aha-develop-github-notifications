# GitHub Notifications

Create a dashboard panel showing your github notifications

## Demo

## Installing the extension

**Note: In order to install an extension into your Aha! Develop account, you must be an account administrator.**

1. Install the GitHub Notifications extension by clicking [here](https://secure.aha.io/settings/account/extensions/install?url=https://github.com/jemmyw/aha-develop-github-notifications/releases/download/1.1.0/kealabs.github-notifications-v1.1.1.gz).
2. Create or visit an existing dashboard panel from Reports.
3. Add a new panel and choose Extension panel <img width="892" alt="Screenshot 2022-05-02 at 11 59 01 AM" src="https://user-images.githubusercontent.com/8016/166170006-5b4a7aac-89b2-40d6-b328-8ef9465cf9ea.png">
4. Select GitHub Notifications
5. Configure with your participation options

<img width="278" alt="CleanShot 2022-05-02 at 12 03 07@2x" src="https://user-images.githubusercontent.com/8016/166170334-5ed91605-b6ff-4d19-9ac5-52f434cb05b2.png">


## Working on the extension

Install [`aha-cli`](https://github.com/aha-app/aha-cli):

```sh
npm install -g aha-cli
```

Clone the repo:

```sh
git clone https://github.com/jemmyw/aha-develop-github-notifications.git
```

**Note: In order to install an extension into your Aha! Develop account, you must be an account administrator.**

Install the extension into Aha! and set up a watcher:

```sh
aha extension:install
aha extension:watch
```

Now, any change you make inside your working copy will automatically take effect in your Aha! account.

## Building

When you have finished working on your extension, package it into a `.gz` file so that others can install it:

```sh
aha extension:build
```

After building, you can upload the `.gz` file to a publicly accessible URL, such as a GitHub release, so that others can install it using that URL.

To learn more about developing Aha! Develop extensions, including the API reference, the full documentation is located here: [Aha! Develop Extension API](https://www.aha.io/support/develop/extensions)
