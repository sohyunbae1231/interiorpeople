import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";

const data = {
    title: "Support",
    rows: [
        {
            title: "guide",
            content: "안녕하세요",
        },
        {
            title: "faq",
            content:
                "안녕하세요",
        },
    ],
};


const styles = {
    // bgColor: 'white',
    titleTextColor: "blue",
    rowTitleColor: "blue",
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
        </div>
    );
}

export default Support;