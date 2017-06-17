import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchPosts} from '../actions/index'
import {Link} from 'react-router';
class PostsIndex extends Component 
{
    componentWillMount()
    {
        //console.log('This will be a good time to call action creator to fetch post');
        this.props.fetchPosts();
    }


    render()
    {
        return(
            <div>
                <div className="text-xs-right">
                    <Link to="/posts/new" className="btn btn-primary">
                        Add a Post
                    </Link> 

                </div>
                List of blog posts
            </div>
            );
    }
}

export default connect(null, {fetchPosts})(PostsIndex);