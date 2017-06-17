import React from 'react';
import json from './layout.json';
import Content from './content.jsx';

class App extends React.Component {
   
    constructor(props)
    {
        super(props);
        
        this.state = {data : json}; //JSON.stringify(json, null)
        
        
    }
    
    render() {
        const page = this.state.data.pages.map((p) => 
        {            
            return <Content header={this.state.data.header} json={p} footer={this.state.data.footer} />                            
        });
        
        return (<div>{page}</div>);

   }
}

export default App;