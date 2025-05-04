import React from 'react';

const SearchWidget = () => {

    const handleSearch = (event) => {
        event.preventDefault()
        event.target.reset()
    }

    return (
        <>
            <div className="sidebar-widget search-box">
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <input type="search" name="search" autoComplete='off' placeholder="Search..." required />
                        <button type="submit"><span className="icon fa fa-search"></span></button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SearchWidget;