import React from 'react';
import '../CSS/MainPage.css'
import { ImOffice } from "react-icons/im";
import { IoSyncSharp } from "react-icons/io5";
import { VscSettingsGear } from "react-icons/vsc";

function MainPage() {

    return (
        <>
            <div className="banner">
                <div className="center">
                    <h1>Wellcome!</h1>
                </div>

                <div className="functionalities">
                    <div className="func">
                        <ImOffice />
                        <h2>Manage Your Companies</h2>
                    </div>
                    <div className="func">
                        <VscSettingsGear />
                        <h2>Manage Your Products</h2>
                    </div>
                    <div className="func">
                        <IoSyncSharp />
                        <h2>Manage Your Transactions</h2>
                    </div>
                </div>    
            </div>
        </>
    );
}

export default MainPage;