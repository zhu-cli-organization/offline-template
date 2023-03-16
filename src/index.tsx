import React from 'react';
import ReactDOM from 'react-dom';
 

 
export interface AppProps {}

 export const App: React.FC<AppProps> = () => {
  return (
    <div>hello</div>
  );
};

ReactDOM.render(<App />, document.querySelector('#app') as HTMLDivElement);
