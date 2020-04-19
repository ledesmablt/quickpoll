import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Option from './../Option'

function Poll({ pollKey, title, users, options }) {
  const optionsComponents = Object.keys(options).map(optionKey =>
    <Option key={optionKey} pollKey={pollKey} optionKey={optionKey} { ...options[optionKey] } />
  );
  return (
    <div className="Poll">
      <h3>{title}</h3>
      <ol>{optionsComponents}</ol>
    </div>
  )
}

export default Poll;