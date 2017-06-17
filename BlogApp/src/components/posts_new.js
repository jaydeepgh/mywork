import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {createPost} from '../actions/index';
import {connect} from 'react-redux';
//const  { DOM: { input, textarea } } = React;


const renderInput = field =>   // Define stateless component to render input and errors
  <div>
    <input {...field.input} type={field.type} className="form-control" />  
  </div>

const renderTextarea = field =>   // Define stateless component to render input and errors
  <div>
    <textarea {...field.input} className="form-control" />  
  </div>



class PostsNew extends Component
{
    render()
    {
        const {handleSubmit} = this.props;
        //console.log(title);
        return(
        <form onSubmit={handleSubmit(this.props.createPost)} >
            <h3>Create a New Post</h3>
            
                <div className="form-group">
                    <label>Title</label>
                        <Field
                            name="title"                   // Specify field name
                            component={renderInput}           // Specify render component above
                            type="text"/> 
                </div>

                <div className="form-group">
                    <label>Categories</label>
                        <Field
                            name="categories"                   // Specify field name
                            component={renderInput}           // Specify render component above
                            type="text"/> 
                </div>

                <div className="form-group">
                    <label>Content</label>
                        <Field
                            name="content"                   // Specify field name
                            component={renderTextarea}           // Specify render component above
                            type="text"/> 
                </div>                


            <button type="submit" className="btn btn-primary">Submit</button>

        </form>
        );
    }
}

export default connect(null, {createPost}) (reduxForm({
    form:'PostNewForm'
})(PostsNew));