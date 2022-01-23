import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { uniqueLabelsSelector } from "../store/enhance";
import { filterSelector, showFilterAtom } from "../store/filters";
import { PULL_REQUEST_STATES } from "../store/helpers/listEnhancedPullRequests";
import { TagFilter } from "./filters/TagFilter";

interface Props {}

export const Filters: React.FC<Props> = () => {
  const setShowFilter = useSetRecoilState(showFilterAtom);
  const availableLabels = useRecoilValue(uniqueLabelsSelector);
  const [labels, setLabels] = useRecoilState(filterSelector("labels"));
  const [states, setStates] = useRecoilState(filterSelector("states"));

  return (
    <div style={{ padding: "8px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <TagFilter
          label="Labels"
          options={availableLabels.map((l) => ({ ...l, color: "#" + l.color }))}
          onChange={setLabels}
          value={labels}
        />

        <TagFilter
          label="State"
          options={Object.values(PULL_REQUEST_STATES)}
          onChange={setStates}
          value={states}
        />

        <aha-button
          onClick={() => setShowFilter(false)}
          kind="secondary"
          style={{ marginTop: "5px" }}
        >
          Done
        </aha-button>
      </div>
    </div>
  );
};
