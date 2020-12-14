import * as React from "react";

interface Props {
  value: string;
  onChange: (newValue: string) => void;
}

export const Typeahead = (props: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    props.onChange(event.target.value);
  };

  return (
    <div className="typeahead">
      <input type="text" value={props.value} onChange={handleChange} />
    </div>
  );
};
