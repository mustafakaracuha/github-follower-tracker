import React from "react";
import Avatar from "@mui/material/Avatar";

function Following({ following }) {
    return (
        <div className="py-4 h-[30rem] ml-10 mt-6 overflow-auto">
            <h3 className="text-xl font-semibold mb-3">Following ({following.length})</h3>
            <ul>
                {following.map((following, index) => (
                    <li
                        onClick={() => window.open(following.html_url, "_blank")}
                        key={index}
                        className=" w-[15rem] cursor-pointer flex items-center justify-between mb-3 py-4 px-5 bg-slate-100 rounded-xl"
                    >
                        <div className="flex items-center">
                            <Avatar alt="Remy Sharp" src={following.avatar_url} />
                            <p className="ml-4">{following.login}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Following;
