import React from "react";

import Avatar from "@mui/material/Avatar";
import { MdRefresh } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

function UserProfile({ userProfile, changeUser, following, username, setUsername }) {
    return (
        <>
            {userProfile ? (
                <div className="w-full flex">
                    <Avatar onClick={() => window.open(userProfile?.html_url, "_blank")} alt="Remy Sharp" sx={{ width: 120, height: 120 }} src={userProfile?.avatar_url} />
                    <div className="w-full ml-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-medium mt-4">{userProfile?.login}</h2>
                                {userProfile.location && (
                                    <p className="text-slate-500 font-normal mt-1 flex items-center">
                                        <FaLocationDot size={15} className="mr-1" /> {userProfile?.location}
                                    </p>
                                )}
                                <p title={userProfile?.bio} className="text-slate-400 font-normal mt-3">
                                    {userProfile?.bio && userProfile.bio.length > 70 ? userProfile.bio.slice(0, 70) + "..." : userProfile.bio}
                                </p>
                            </div>

                            {userProfile && following.length > 0 && (
                                <div className="">
                                    <button onClick={changeUser} className="bg-red-100 py-3 px-3 transition-all duration-300  rounded-xl text-red-500 text-sm font-bold hover:bg-red-200">
                                        Change User
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <input
                    autoFocus
                    type="text"
                    placeholder="GitHub Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border outline-none transition-all duration-300 focus:ring-2 focus:ring-amber-400 rounded-xl p-3 w-full"
                />
            )}
        </>
    );
}

export default UserProfile;
