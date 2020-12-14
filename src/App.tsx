import * as React from "react";
import { useState } from "react";
import { Typeahead } from "./components/Typeahead";
import termsToMatch from "./data/termsToMatch";
import "./App.scss";

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  return (
    <div className="app">
      <Typeahead
        value={inputValue}
        onChange={handleInputChange}
        termsToMatch={termsToMatch}
      />
    </div>
  );
};

export default App;
