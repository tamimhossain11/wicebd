import React from 'react';
import HeaderV1 from '../../components/header/HeaderV1';
import BreadCrumb from '../../components/breadCrumb/BreadCrumb';
import BuyTicketContent from '../../components/ticket/BuyTicketContent';
import FooterV1 from '../../components/footer/FooterV1';

const BuyTicket = () => {
    return (
        <>
            <div className="page-wrapper">
                <span className="header-span"></span>
                <HeaderV1 headerStyle="header-style-two" parentMenu='schedule' />
                <BreadCrumb title="Buy Ticket" breadCrumb="buy-ticket" />
                <BuyTicketContent />
                <FooterV1 />
            </div>
        </>
    );
};

export default BuyTicket;