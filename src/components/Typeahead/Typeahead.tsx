import * as React from "react";
import classNames from "classnames";
import { useState, useEffect, useRef } from "react";
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
  matches?: any;
}

export function Typeahead(props: Props) {
  const [matchedTerms, setMatchedTerms] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isSuggestionListShown, setIsSuggestionListShown] = useState(false);
  const selectedItem = useRef(null);
  const inputField = useRef(null);

  useEffect(() => {
    setSelectedItemIndex(null);
    if (props.termsToMatch) {
      setMatchedTerms(fuzzyFind(props.value, props.termsToMatch));
    }
  }, [props.termsToMatch, props.value]);
  useEffect(() => {
    if (!matchedTerms.length) {
      setIsSuggestionListShown(false);
    }
  }, [matchedTerms]);
  useEffect(() => {
    if (selectedItem.current) {
      selectedItem.current.scrollIntoView();
    }
  }, [selectedItemIndex]);

  function fuzzyFind(
    query: string,
    termsToMatch: Array<string>
  ): Array<FuseResult> {
    const options = {
      includeMatches: true,
    };
    const fuse = new Fuse(termsToMatch, options);
    return fuse.search(query);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    props.onChange(event.target.value);
    setIsSuggestionListShown(true);
  }

  function handleClickSuggestion(event): void {
    props.onChange(event.target.value);
    inputField.current.focus();
    setIsSuggestionListShown(false);
  }

  function handleKeydown(event) {
    if (!isSuggestionListShown) return;
    // NOTE: Disallow key navigation if the suggestion list is hidden.
    let newSelectedItemIndex;
    switch (event.key) {
      case "ArrowUp":
        if (!selectedItemIndex) {
          // NOTE: Conveniently, this will match both null and 0.
          newSelectedItemIndex = matchedTerms.length - 1;
        } else {
          newSelectedItemIndex = selectedItemIndex - 1;
        }
        setSelectedItemIndex(newSelectedItemIndex);
        break;
      case "ArrowDown":
        if (selectedItemIndex === null) {
          // NOTE: Here that same convenience is annoying.
          newSelectedItemIndex = 0;
        } else if (selectedItemIndex + 1 === matchedTerms.length) {
          newSelectedItemIndex = 0;
        } else {
          newSelectedItemIndex = selectedItemIndex + 1;
        }
        setSelectedItemIndex(newSelectedItemIndex);
        break;
      case "Enter":
        if (!!selectedItemIndex) {
          props.onChange(matchedTerms[selectedItemIndex].item);
          inputField.current.focus();
        }
        setIsSuggestionListShown(false);
        break;

      default:
        break;
    }
  }

  function renderHighlghtedText(query: string, item: FuseResult) {
    // NOTE: The way the highlighting is implemented is not very useful for the
    // user. A better way would be to implement a simple secondary substring
    // search to highlight only full matches. This would, however, take me more
    // time and I've spent more than the three hours as it is.
    const indices = item.matches[0].indices.flat();
    // NOTE: This will have some duplicates, but I'm not sure if de-duplicating
    // this array will bring any performance gains at this scale.
    return item.item.split("").map((character: string, index: number) => {
      return (
        <span
          className={classNames({
            "typeahead__suggestion-list__item__text": true,
            "typeahead__suggestion-list__item__text--highlighted": indices.includes(
              index
            ),
          })}
        >
          {character}
        </span>
      );
    });
  }

  function renderSuggestionList(list: Array<FuseResult>) {
    return (
      <div className="typeahead__suggestion-list" tabIndex={-1}>
        {list.map((item: FuseResult, index: number) => (
          <button
            tabIndex={-1}
            className={classNames({
              "typeahead__suggestion-list__item": true,
              "typeahead__suggestion-list__item--selected":
                index === selectedItemIndex,
            })}
            ref={index === selectedItemIndex ? selectedItem : null}
            key={`${item.item}-${item.refIndex}`}
            onClick={handleClickSuggestion}
            value={item.item}
          >
            {renderHighlghtedText(props.value, item)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="typeahead" onKeyDown={handleKeydown}>
      <input
        className="typeahead__input-field"
        type="text"
        value={props.value}
        onChange={handleChange}
        ref={inputField}
      />
      {isSuggestionListShown && renderSuggestionList(matchedTerms)}
    </div>
  );
}
