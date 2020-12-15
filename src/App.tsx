import * as React from "react";
import { useState } from "react";
import { Typeahead } from "./components/Typeahead";
import termsToMatch from "./data/termsToMatch";
import "./App.scss";

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("");

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };
  const handleSuggest = (newValue: string) => {
    setInputPlaceholder(newValue);
  };

  return (
    <div className="app">
      <Typeahead
        value={inputValue}
        placeholder={inputPlaceholder}
        onChange={handleInputChange}
        onSuggest={handleSuggest}
        termsToMatch={termsToMatch}
      />
    </div>
  );
};

export default App;
