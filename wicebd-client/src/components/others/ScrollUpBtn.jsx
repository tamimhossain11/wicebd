import React, { useEffect, useState } from 'react';

const ScrollUpBtn = () => {

    const [scrollUpButton, setScrollUpButton] = useState(false)

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 200) {
                setScrollUpButton(true)
            } else {
                setScrollUpButton(false)
            }
        })
    }, [])

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <>
            {scrollUpButton && (
                <button className='customScrollUp' onClick={scrollUp}><i className="fa fa-angle-double-up"></i></button>
            )}
        </>
    );
};

export default ScrollUpBtn;