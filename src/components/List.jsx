import React, { useState, useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Alert from '@mui/material/Alert';

import { MdSearch, MdRefresh } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { FaLocationDot } from "react-icons/fa6";
import { getFollowers, getFollowing, getMyProfile } from "../api/apiCall";

const GitHubFollowerList = () => {
    const [username, setUsername] = useState("");
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [unfollowers, setUnfollowers] = useState([]);
    const [error, setError] = useState();


    const [userProfile, setUserProfile] = useState();
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [buttonText, setButtonText] = useState("Search");

    useEffect(() => {
        findUnfollowers();
    }, [followers, following, refresh]);

    useEffect(() => {
        if (refresh) {
            searchFollowers()
        }
    }, [refresh]);

    const getProfile = async () => {
        try {
            const response = await getMyProfile(username);
            setUserProfile(response.data);
        } catch (apiError) {
            setError(apiError.response.data.message)
        }
    };

    const searchFollowers = async () => {
        setLoading(true);
        setButtonText("Please wait...");
        try {
            let followersData = [];
            let page = 1;

            while (true) {
                const response = await getFollowers(username, page);

                if (response && response.status === 200) {
                    const data = response.data;

                    if (data.length === 0) {
                        break;
                    }

                    followersData = [...followersData, ...data];
                    page++;
                } else {
                    console.error("Error fetching followers:", response.statusText);
                    break;
                }
            }
            setFollowers(followersData);
            getProfile();
            searchFollowing();
            setError("")
        } catch (apiError) {
            console.error("Error fetching followers:", apiError.message);
            setError(apiError.message)
            setLoading(false);
            setButtonText("Search");
        }
    };

    const searchFollowing = async () => {
        try {
            let followingData = [];
            let page = 1;

            while (true) {
                const response = await getFollowing(username, page);

                if (response && response.status === 200) {
                    const data = response.data;

                    if (data.length === 0) {
                        break;
                    }

                    followingData = [...followingData, ...data];
                    page++;
                } else {
                    console.error("Error fetching following:", response.statusText);
                    alert(response.statusText)
                    break;
                }
            }

            setFollowing(followingData);
            if (refresh) {
                setRefresh(false);
            }
            setError("")
            findUnfollowers();
        } catch (apiError) {
            console.error("Error fetching following:", apiError.message);
            setLoading(false);
            setRefresh(false);
            setButtonText("Search");
        }
    };

    const findUnfollowers = () => {
        const followersLogins = followers.map((follower) => follower.login);
        const unfollowers = following.filter((follower) => !followersLogins.includes(follower.login));
        setUnfollowers(unfollowers);
        setLoading(false);
        setError("")
        setButtonText("Search");
    };

    const changeUser = () => {
        setFollowers([])
        setFollowing([])
        setUnfollowers([])
        setUserProfile("");
        setUsername("");
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-auto bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold mb-5">GitHub Follower Tracker</h2>
                </div>
                <div className="mb-5">
                    {userProfile ? (
                        <div className="w-full flex">
                            <Avatar alt="Remy Sharp" sx={{ width: 120, height: 120 }} src={userProfile?.avatar_url} />
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

                                    {userProfile && (
                                        <div className="">
                                            <button onClick={changeUser} className="bg-red-100 py-3 px-3 transition-all duration-300  rounded-xl text-red-500 text-sm font-bold hover:bg-red-200">
                                               Change User
                                            </button>
                                            {followers.length > 0 && following.length > 0 && (
                                                <button
                                                    onClick={() => setRefresh(true)}
                                                    className="h-10 mt-3 flex items-center justify-center bg-green-200 text-green-800 py-3 px-3 transition-all duration-300 rounded-xl outline-none hover:bg-green-300"
                                                >
                                                    <MdRefresh size={20} className={refresh ? "mr-2 animate-spin" : "mr-2"} />
                                                    Refresh
                                                </button>
                                            )}
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
                </div>
                <div className="flex flex-col items-start">
                    {!userProfile && (
                    <>
                      {error &&
                        <Alert className="mb-3 !rounded-xl !bg-red-500" variant="filled" severity="error">
                        {error}
                      </Alert>
                        }
                        <button
                            onClick={searchFollowers}
                            disabled={!username.length}
                            className="h-10 flex items-center justify-center bg-blue-500 text-white py-3 px-4 transition-all duration-300 rounded-xl hover:bg-blue-300 disabled:bg-blue-300"
                        >
                            {loading ? <CgSpinner size={20} className="mr-2 animate-spin" /> : <MdSearch size={20} className="mr-2" />}
                            {buttonText}
                        </button>
                      
                        
                      </>
                    )}
                </div>
                {userProfile && followers.length > 0 && following.length > 0 && (
                    <div className="flex mt-2">
                        <div className="py-4 h-[30rem] ml-3 mt-6 overflow-auto">
                            <h3 className="text-xl font-semibold mb-3">Followers ({followers.length})</h3>
                            <ul>
                                {followers.map((follower, index) => (
                                    <li key={index} className="w-[15rem] flex items-center justify-start mb-3 py-4 pl-4 bg-slate-100 rounded-xl">
                                        <Avatar alt="Remy Sharp" src={follower.avatar_url} />
                                        <p className="ml-4">{follower.login}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="py-4 h-[30rem] ml-10 mt-6 overflow-auto">
                            <h3 className="text-xl font-semibold mb-3">Following ({following.length})</h3>
                            <ul>
                                {following.map((following, index) => (
                                    <li key={index} className=" w-[15rem] flex items-center justify-between mb-3 py-4 px-5 bg-slate-100 rounded-xl">
                                        <div className="flex items-center">
                                            <Avatar alt="Remy Sharp" src={following.avatar_url} />
                                            <p className="ml-4">{following.login}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="py-4 h-[30rem] ml-10 mt-6 overflow-auto">
                            <h3 className="text-xl font-semibold mb-3">Unfollowers ({unfollowers.length})</h3>
                            <ul>
                                {unfollowers.map((unfollower, index) => (
                                    <li
                                        key={index}
                                        className="w-[21rem] flex items-center group/item justify-between mb-3 py-4 px-5 bg-slate-100 transition-all duration-300 hover:bg-slate-50 cursor-pointer rounded-xl"
                                    >
                                        <div className="flex items-center">
                                            <Avatar alt="Remy Sharp" src={unfollower.avatar_url} className="transition-all duration-300 group-hover/item:!scale-110" />
                                            <p className="ml-4">{unfollower.login}</p>
                                        </div>
                                        <a
                                            href={unfollower.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-100 py-3 px-3 transition-all duration-300 group-hover/item:bg-blue-400 group-hover/item:text-white  rounded-xl text-blue-500 text-xs font-bold"
                                        >
                                            Unfollow
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GitHubFollowerList;
