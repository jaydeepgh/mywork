import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MyElement from './myelement.jsx';

class Header extends Component
{
    
    constructor(props)
    {
        super(props);
        this.state = {term : props.json}; 
    }
    
    render()
    {        
        const elms = this.state.term.fields.map((field) => {
            return <MyElement field={field} />
        });                
        return(<div className={this.state.term.className}>{elms}</div>);
    }
} 

export default Header;