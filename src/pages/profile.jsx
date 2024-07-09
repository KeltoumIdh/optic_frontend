import React, { useState } from "react";
import {Informations} from "./profile/CardInformations"
import {Update} from "./profile/CardPassword"

const Profile = () => {


    return (
        <div className="w-full">
        <h4 className="text-2xl font-semibold dark:text-gray-300">
            Profile
        </h4>
        <div className="flex flex-col lg:flex-row md:flex-row">
            <Informations className="w-full" />
            <Update className="w-full" /> 
        </div>
    </div>
    
       


    );
};

export default Profile;
