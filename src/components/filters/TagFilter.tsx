import React, { useCallback } from "react";
import Color from "color";
import Select, { StylesConfig, MultiValue } from "react-select";
import { useRecoilValue } from "recoil";
import { uniqueLabelsSelector } from "../../store/enhance";

interface Tag {
  name: string;
  color: string;
}

interface Props {
  label: string;
  options: Tag[];
  value: string[];
  onChange(newValue: string[]): void;
}

const colorCache = new Map<string, Color>();
const labelColor = (tag: Tag) => {
  if (colorCache.has(tag.color)) return colorCache.get(tag.color) as Color;
  const color = new Color(tag.color);
  colorCache.set(tag.color, color);
  return color;
};

const colorStyles: StylesConfig<Tag, true> = {
  menuList: (styles) => {
    return { ...styles, display: "flex", flexWrap: "wrap", gap: "5px" };
  },
  option: (styles, { data }) => {
    const color = labelColor(data).whiten(0.4);

    return {
      ...styles,
      borderRadius: "5px",
      padding: "5px 8px",
      backgroundColor: color.hex(),
      color: color.isDark() ? "white" : "black",
      fontSize: "90%",
      width: "auto",
    };
  },
  multiValue: (styles, { data }) => {
    const color = labelColor(data);

    return {
      ...styles,
      borderRadius: "5px",
      backgroundColor: color.hex(),
      color: color.isDark() ? "white" : "black",
    };
  },
  multiValueLabel: (styles, { data }) => {
    const color = labelColor(data);

    return {
      ...styles,
      color: color.isDark() ? "white" : "black",
    };
  },
};

export function TagFilter({ label, options, value, onChange }: Props) {
  const handleChange = useCallback(
    (newValue: MultiValue<Tag>) => {
      onChange(newValue.map((l) => l.name));
    },
    [onChange]
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label style={{ fontSize: "95%" }}>{label}</label>
      <Select
        options={options}
        getOptionLabel={(tag) => tag.name}
        getOptionValue={(tag) => tag.name}
        styles={colorStyles}
        classNamePrefix="select"
        isMulti={true}
        onChange={handleChange}
        value={
          value
            .map((v) => options.find((o) => o.name === v))
            .filter(Boolean) as Tag[]
        }
      />
    </div>
  );
}
