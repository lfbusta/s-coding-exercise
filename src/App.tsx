import * as React from "react";
import { useState } from "react";
import { Typeahead } from "./components/Typeahead";
import "./App.scss";

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  return (
    <div className="app">
      <Typeahead value={inputValue} onChange={handleInputChange} />
    </div>
  );
};

export default App;
