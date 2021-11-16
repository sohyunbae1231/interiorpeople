import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";

const data = {
    title: "FAQ",
    rows: [
        {
            title: "faq first",
            content: "안녕하세요",
        },
        {
            title: "faq second",
            content:
                "안녕하세요",
        },
    ],
};


const styles = {
    // bgColor: 'white',
    titleTextColor: "#203864",
    rowTitleColor: "black",
    // rowContentColor: 'grey',
    // arrowColor: "red",
};

const config = {
    // animate: true,
    // arrowIcon: "V",
    // tabFocus: true
};

function Qna() {

    return (
        <div>
            <Faq
                data={data}
                styles={styles}
                config={config}
            />
        </div>
    );
}

export default Qna;