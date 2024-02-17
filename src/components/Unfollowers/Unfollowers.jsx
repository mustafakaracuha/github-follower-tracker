import React from "react";
import Avatar from "@mui/material/Avatar";

import { CgSpinner } from "react-icons/cg";

function Unfollowers({ unfollowers, handleUnfollow }) {
    return (
        <div className="py-4 h-[30rem] ml-10 mt-6 overflow-auto">
            <h3 className="text-xl font-semibold mb-3">Unfollowers ({unfollowers.length})</h3>
            <ul>
                {unfollowers
                    .sort((a, b) => a.login.localeCompare(b.login))
                    .map((unfollower, index) => (
                        <li
                            key={index}
                            className="w-[21rem] flex items-center group/item justify-between mb-3 py-4 px-5 bg-slate-100 transition-all duration-300 hover:bg-slate-50 cursor-pointer rounded-xl"
                        >
                            <div className="flex items-center">
                                <Avatar alt="Remy Sharp" src={unfollower.avatar_url} className="transition-all duration-300 group-hover/item:!scale-110" />
                                <p className="ml-4 text-ellipsis truncate w-40">{unfollower.login}</p>
                            </div>
                            <button
                                onClick={() => handleUnfollow(unfollower.login, index)}
                                className="w-[4.5rem] h-[2.5rem] flex items-center justify-center bg-blue-100 transition-all duration-300 group-hover/item:bg-blue-400 group-hover/item:text-white  rounded-xl text-blue-500 text-xs font-bold"
                            >
                                {unfollower.loadingIndex === index ? <CgSpinner size={24} className="animate-spin text-blue-500" /> : <span>Unfollow</span>}
                            </button>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default Unfollowers;
