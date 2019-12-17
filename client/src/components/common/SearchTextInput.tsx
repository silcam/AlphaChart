import React, { useState } from "react";
import useSearch from "./useSearch";

const MIN_QUERY_LENGTH = 2;

interface IProps<SearchItem> {
  text?: string;
  sendQuery: (q: string) => Promise<SearchItem[] | null>;
  updateValue: (value: SearchItem | null) => void;
  itemId: (item: SearchItem) => string;
  itemDisplay: (item: SearchItem) => string;
  placeholder?: string;
  autoFocus?: boolean;
  allowBlank?: boolean;
  addBox?: boolean;
}

export default function SearchTextInput<SearchItem>(props: IProps<SearchItem>) {
  const [query, setQuery] = useState(props.text || "");
  const [showResults, setShowResults] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(-1);
  const results = useSearch<SearchItem>(
    props.sendQuery,
    query,
    MIN_QUERY_LENGTH
  );

  const save = (item: SearchItem | null) => {
    setQuery(props.addBox || !item ? "" : props.itemDisplay(item));
    setShowResults(false);
    props.updateValue(item);
  };

  const saveBlank = () => save(null);

  const updateQuery = (q: string) => {
    setQuery(q);
    setShowResults(true);
    if (q.length == 0 && props.allowBlank) saveBlank();
  };

  const handleKeyDown = (key: string) => {
    if (results === undefined) return;
    switch (key) {
      case "ArrowUp":
        setSelectedPosition(Math.max(selectedPosition - 1, -1));
        break;
      case "ArrowDown":
        setSelectedPosition(Math.min(selectedPosition + 1, results.length - 1));
        break;
      case "Enter":
      case "Tab":
        const index = Math.max(selectedPosition, 0);
        if (results[index]) save(results[index]);
        else saveBlank();
    }
  };

  const handleBlur = () => {
    if (props.allowBlank && query.length == 0) saveBlank();
    setShowResults(false);
  };

  const placeholder = props.placeholder || "";
  return (
    <div className="compSearchTextInput">
      <input
        type="text"
        name="query"
        value={query}
        onChange={e => updateQuery(e.target.value)}
        onKeyDown={e => handleKeyDown(e.key)}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoFocus={props.autoFocus}
      />
      {showResults && results && (
        <ul onMouseLeave={() => setSelectedPosition(-1)}>
          {results.map((item, index) => {
            const className = index == selectedPosition ? "selected" : "";
            return (
              <li
                key={props.itemId(item)}
                className={className}
                onMouseDown={() => {
                  save(item);
                }}
                onMouseEnter={() => {
                  setSelectedPosition(index);
                }}
              >
                {props.itemDisplay(item)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
