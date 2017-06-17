/*
Purpose : create a react functional component based on defined json
Written by : Jaydeep Ghosh
Date : 17-Mar-2017 
*/

import React, {Component} from 'react';

    const getElement = (field, component) =>
    {
        switch(String([field.type]))
        {
            case 'img':
                return <img id={field.id} src={field.value} className ={field.className} />
            case 'input':
                return (<input id={field.id} name={field.name} type={field.inputtype} value={field.value} 
                           onChange= {event => this.setState({term:event.target.value})} /> 

                        );
            case 'select':
                return <select id={field.id} name={field.id} 
                           onChange= {event => component.setState({term:event.target.value})}>
                    {field.options.map((opt) => {
                        return getElement(opt)
                    })}
                </select>
            case 'option':
                return <option value={field.value}>{field.value}</option>
            case 'textarea':
                return( <textarea id={field.id} rows={field.rows} cols={field.cols}>{field.value}</textarea> );
            case 'label':
                return <span id={field.id} className = {field.className}>{field.value}</span>
            case 'form':
                return (<form id={field.id} className = {field.className}>
                    {(typeof [field.fields] != 'undefined' && [field.fields.length] > 0) ?                       
                            field.fields.map((el) =>{                                
                                    return getElement(el)                            
                                }) : ''
                    }</form>);
            case 'div':   
                return (<div id={field.id} className = {field.className}>
                    {(typeof [field.fields] != 'undefined' && [field.fields.length] > 0) ? 
                                field.fields.map((el) =>{                        
                                    return getElement(el)                            
                                }) : '' 
                    }{field.value}</div>);
            case 'br':
                return <br />            
            case 'p':   
                return <p id={field.id} className = {field.className}>{field.value}</p>
            default:
                return null;
        }         
    }

class MyElement extends Component
{    
    constructor(props)
    {
        super(props);
        
        this.state = {term : '', field : props.field};
    }
    
    render ()
    {
        return(getElement(this.state.field,this));
        
    }

}

export default MyElement;