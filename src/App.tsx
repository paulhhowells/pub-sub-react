import React from 'react';
import './App.css';
import { PubSub } from './PubSub';

function App () {
  const [ value, setValue ] = React.useState('');
  React.useEffect(() => {
    const callback = (x: any): void => { setValue(x) };

    PubSub.subscribe('one', callback);
  }, [])

  return (
    <div className="App">
      <h1>Pub Sub Proof Of Concept</h1>
      <p>{ value }</p>
    </div>
  );
}

export default App;
