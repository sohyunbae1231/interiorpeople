import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";
import Qna from "./Qna";

const data = {
    title: "Guide",
    rows: [
        {
            title: "first guide",
            content: "안녕하세요",
        },
        {
            title: "second guide",
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

function Support() {

    return (
        <div>
            <Faq
                data={data}
                styles={styles}
                config={config}
            />
            <Qna></Qna>
        </div>
    );
}

export default Support;