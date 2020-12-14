import * as React from "react";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";

interface Props {
  value: string;
  onChange: (newValue: string) => void;
  termsToMatch?: Array<string>;
}

interface FuseResult {
  item: string;
  refIndex: number;
  score?: number;
}

export const Typeahead = (props: Props) => {
  const [matchedTerms, setMatchedTerms] = useState([]);
  useEffect(() => {
    if (props.termsToMatch) {
      setMatchedTerms(fuzzyFind(props.value, props.termsToMatch));
    }
  }, [props.termsToMatch, props.value]);

  const fuzzyFind = (
    query: string,
    termsToMatch: Array<string>
  ): Array<FuseResult> => {
    const options = {
      includeScore: true,
    };
    const fuse = new Fuse(termsToMatch, options);
    return fuse.search(query);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    props.onChange(event.target.value);
  };

  const handleClickSuggestion = (event): void => {
    props.onChange(event.target.value);
  };

  const renderSuggestionList = (list: Array<FuseResult>) => {
    return list.map((item: FuseResult) => (
      <button
        className="typeahead__suggestion-list__item"
        key={`${item.item}-${item.refIndex}`}
        onClick={handleClickSuggestion}
        value={item.item}
      >
        {item.item}
      </button>
    ));
  };

  return (
    <div className="typeahead">
      <input
        className="typehead__input-field"
        type="text"
        value={props.value}
        onChange={handleChange}
      />
      {matchedTerms.length && renderSuggestionList(matchedTerms)}
    </div>
  );
};
