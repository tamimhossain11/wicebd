import React from 'react';
import { toast } from 'react-toastify';

const BlogForm = () => {

    const handleComment = (event) => {
        event.preventDefault()
        event.target.reset()
        toast.success("Thanks for your Comment!")
    }

    return (
        <>
            <form onSubmit={handleComment}>
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-12 col-sm-12 form-group">
                        <input type="text" name="username" placeholder="Name" autoComplete='off' required />
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 form-group">
                        <input type="email" name="email" placeholder="Email" autoComplete='off' required />
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                        <textarea name="message" placeholder="Your Comments" autoComplete='off' required ></textarea>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                        <button className="theme-btn btn-style-one" type="submit" name="submit-form">
                            <span className="btn-title">Post Comment</span>
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default BlogForm;