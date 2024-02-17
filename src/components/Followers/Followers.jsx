import React from "react";
import Avatar from "@mui/material/Avatar";

function Followers({ followers }) {
    return (
        <div className="py-4 h-[30rem] ml-3 mt-6 overflow-auto">
            <h3 className="text-xl font-semibold mb-3">Followers ({followers.length})</h3>
            <ul>
                {followers.map((follower, index) => (
                    <li
                        onClick={() => window.open(follower.html_url, "_blank")}
                        key={index}
                        className="w-[15rem] flex items-center cursor-pointer justify-start mb-3 py-4 pl-4 bg-slate-100 rounded-xl"
                    >
                        <Avatar alt="Remy Sharp" src={follower.avatar_url} />
                        <p className="ml-4">{follower.login}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Followers;
