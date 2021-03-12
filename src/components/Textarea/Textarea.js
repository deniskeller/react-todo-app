import React, { useState } from 'react';

const Textarea = ({ value }) => {
  console.log('value: ', value);
  const [text, setText] = useState(value);

  return (
    <textarea
      placeholder="Enter a title for this card..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    ></textarea>
  );
};

export default Textarea;
