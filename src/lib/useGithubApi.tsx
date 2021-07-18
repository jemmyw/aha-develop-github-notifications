import { useAuth } from "@aha-app/aha-develop-react";
import { Octokit } from "@octokit/rest";
import { useSetRecoilState } from "recoil";
import { authTokenState } from "../store/notifications";

interface GithubApiCallback<R> {
  (api: Octokit): Promise<R>;
}

export function useGithubApi<R>(
  callback: GithubApiCallback<R>,
  deps: any[] = []
) {
  const setAuthToken = useSetRecoilState(authTokenState);

  const authCallback = async (authData: any) => {
    setAuthToken(authData.token);
    return await callback(new Octokit({ auth: authData.token }));
  };

  return useAuth(authCallback, {}, deps as any);
}
