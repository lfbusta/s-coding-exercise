import * as React from "react";
import classNames from "classnames";
import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";

interface Props {
  value: string;
  placeholder: string;
  onChange: (newValue: string) => void;
  onSuggest: (newValue: string) => void;
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
    props.onSuggest("");
    props.onChange(event.target.value);
    inputField.current.focus();
    setIsSuggestionListShown(false);
  }
  function handleMouseEnterSuggestion(event): void {
    props.onSuggest(event.target.value);
  }
  function handleMouseLeaveSuggestion(): void {
    props.onSuggest("");
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
        if (!!props.onSuggest)
          props.onSuggest(matchedTerms[newSelectedItemIndex].item);
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
        props.onSuggest(matchedTerms[newSelectedItemIndex].item);
        setSelectedItemIndex(newSelectedItemIndex);
        break;
      case "Enter":
        if (!!selectedItemIndex) {
          props.onSuggest("");
          props.onChange(matchedTerms[selectedItemIndex].item);
          inputField.current.focus();
        }
        setIsSuggestionListShown(false);
        break;
      case "Escape":
        props.onSuggest("");
        inputField.current.focus();
        break;
      case "Backspace":
        props.onSuggest("");
        inputField.current.focus();
        break;
      case "Delete":
        props.onSuggest("");
        inputField.current.focus();
        break;

      default:
        break;
    }
  }

  function renderHighlghtedText(item: FuseResult) {
    // NOTE: Takes only the first match to highlight. This seemed more useful
    // than highlighting every match instance.
    const indices = item.matches[0].indices[0];
    return item.item.split("").map((character: string, index: number) => {
      return (
        <span
          key={`suggestion-${item.item}-${index}`}
          className={classNames({
            "typeahead__suggestion-list__item__text": true,
            "typeahead__suggestion-list__item__text--highlighted":
              index >= indices[0] && index <= indices[1],
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
            onMouseEnter={handleMouseEnterSuggestion}
            onMouseLeave={handleMouseLeaveSuggestion}
            value={item.item}
          >
            {renderHighlghtedText(item)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="typeahead" onKeyDown={handleKeydown}>
      <input
        className={classNames({
          "typeahead__input-field": true,
          "typeahead__input-field--pre-filled": !!props.placeholder,
        })}
        type="text"
        value={props.placeholder || props.value}
        onChange={handleChange}
        ref={inputField}
      />
      {isSuggestionListShown && renderSuggestionList(matchedTerms)}
    </div>
  );
}
