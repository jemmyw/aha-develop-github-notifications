import { useAuth } from "@aha-app/aha-develop-react";
import { Octokit } from "@octokit/rest";

interface GithubApiCallback<R> {
  (api: Octokit): Promise<R>;
}

export function useGithubApi<R>(
  callback: GithubApiCallback<R>,
  deps: any[] = []
) {
  const authCallback = async (authData: any) => {
    const api = new Octokit({ auth: authData.token });
    return await callback(api);
  };

  return useAuth(authCallback, {}, deps as any);
}
