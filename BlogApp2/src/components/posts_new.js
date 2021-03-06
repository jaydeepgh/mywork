import React, {Component} from 'react';
import {reduxForm} from 'redux-form';

class PostsNew extends Component
{
    render()
    {
        const {fields: {title, categories, content} , handleSubmit} = this.props;
        console.log(title);
        return(
        <form onSubmit={handleSubmit}>
            <h3>Create a New Post</h3>
            <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" />
            </div>
            <div className="form-group">
                <label>Categories</label>
                <input type="text" className="form-control" />
            </div>
            <div className="form-group">
                <label>Content</label>
                <textarea className="form-control" />
            </div>        

            <button type="submit" className="btn btn-primary">Submit</button>

        </form>
        );
    }
}

export default reduxForm({
    form:'PostNewForm',
    fields : ['title', 'categories', 'content']
})(PostsNew);