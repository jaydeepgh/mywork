import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MyElement from './myelement.jsx';
import Header from './header.jsx';
import Footer from './footer.jsx';

class Content extends Component
{
    
    constructor(props)
    {
        super(props);
        this.state = {content : props.json,
                     header : props.header,
                     footer : props.footer
                     }; 
    }
    
    render()
    {        
        const elms = this.state.content.fields.map((field) => {
            return <MyElement field={field} />
        });                
        return(
            <div className="pageStyle">
                <Header json={this.state.header} />
                <div className={this.state.content.className}>{elms}</div>
                <Footer json={this.state.footer}  />  
            </div>);
    }
} 

export default Content;