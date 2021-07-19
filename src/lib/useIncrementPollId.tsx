import { useSetRecoilState } from "recoil";
import { listNotificationsSelector, pollId } from "../store/notifications";

export function useIncrementPollId() {
  const setPollId = useSetRecoilState(pollId);
  const setList = useSetRecoilState(listNotificationsSelector);

  const incrementPollId = (reload?: boolean) => {
    if (reload) {
      setList([]);
    } else {
      setPollId((pollId) => pollId + 1);
    }
  };
  return incrementPollId;
}
