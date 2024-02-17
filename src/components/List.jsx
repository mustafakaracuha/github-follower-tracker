import React, { useState, useEffect } from "react";

import Alert from "@mui/material/Alert";

import { MdSearch } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";

import UserProfile from "./UserProfile/UserProfile";
import Followers from "./Followers/Followers";
import Following from "./Following/Following";
import Unfollowers from "./Unfollowers/Unfollowers";

import { getFollowers, getFollowing, getMyProfile, userUnfollow } from "../api/apiCall";

const GitHubFollowerList = () => {
    const [username, setUsername] = useState("");
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [unfollowers, setUnfollowers] = useState([]);
    const [error, setError] = useState();

    const [userProfile, setUserProfile] = useState();
    const [loading, setLoading] = useState(false);
    const [unfLoading, setUnfLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [buttonText, setButtonText] = useState("Search");

    useEffect(() => {
        findUnfollowers();
    }, [followers, following]);

    const getProfile = async () => {
        try {
            const response = await getMyProfile(username);
            setUserProfile(response.data);
        } catch (apiError) {
            setError(apiError.response.data.message);
        }
    };

    const searchFollowers = async () => {
        setLoading(true);
        setButtonText("Please wait...");

        try {
            let allFollowers = [];
            let page = 1;

            while (true) {
                const response = await getFollowers(username, page);

                if (response && response.status === 200) {
                    const data = response.data;

                    if (data.length === 0) {
                        break;
                    }

                    allFollowers = [...allFollowers, ...data];
                    page++;
                } else {
                    break;
                }
            }
            setFollowers(allFollowers);
            searchFollowing();
            if(!userProfile) {
                getProfile();
            }
            setError("");
        } catch (apiError) {
            console.error("Error fetching followers:", apiError.message);
            setError(apiError.message);
        } finally {
            setLoading(false);
            setButtonText("Search");
        }
    };

    const searchFollowing = async () => {
        try {
            let page = 1;
            let allFollowing = [];

            while (true) {
                const response = await getFollowing(username, page);

                if (response && response.status === 200) {
                    const data = response.data;

                    if (data.length === 0) {
                        break;
                    }

                    allFollowing = [...allFollowing, ...data];
                    page++;
                } else {
                    break;
                }
            }

            setFollowing(allFollowing);
            setError("");
        } catch (apiError) {
            console.error("Error fetching following:", apiError.message);
            setButtonText("Search");
        }
    };

    const findUnfollowers = () => {
        const followersLogins = followers.map((follower) => follower.login);
        const unfollowers = following.filter((follower) => !followersLogins.includes(follower.login));
        setUnfollowers(unfollowers);
        setRefresh(false);
        setLoading(false);
        setError("");
        setButtonText("Search");
    };

    const handleUnfollow = async (username, loadingIndex) => {
        try {
            setUnfollowers((prevUnfollowers) =>
                prevUnfollowers.map((follower, index) => ({
                    ...follower,
                    loadingIndex: index === loadingIndex ? index : undefined,
                }))
            );
            const response = await userUnfollow(username);
            if (response.status === 204) {
                searchFollowers();
            }
        } catch (error) {
            console.error("Bir hata oluştu:", error);
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setTimeout(() => {
                setUnfollowers((prevUnfollowers) =>
                    prevUnfollowers.map((follower, index) => ({
                        ...follower,
                        loadingIndex: undefined,
                    }))
                );
            }, 2000);
        }
    };

    const changeUser = () => {
        setFollowers([]);
        setFollowing([]);
        setUnfollowers([]);
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
                    <UserProfile
                        userProfile={userProfile}
                        changeUser={changeUser}
                        refresh={refresh}
                        setRefresh={setRefresh}
                        followers={followers}
                        following={following}
                        username={username}
                        setUsername={setUsername}
                    />
                </div>
                <div className="flex flex-col items-start">
                    {!userProfile && (
                        <>
                            {error && (
                                <Alert className="mb-3 !rounded-xl !bg-red-500" variant="filled" severity="error">
                                    {error}
                                </Alert>
                            )}
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
                {userProfile && followers.length > 0 && following.length > 0 ? (
                    <div className="flex mt-2">
                        <Followers followers={followers} />
                        <Following following={following} />
                        <Unfollowers unfollowers={unfollowers} handleUnfollow={handleUnfollow} unfLoading={unfLoading} />
                    </div>
                ) : (
                    (loading === false && followers.length <= 0) ||
                    (unfollowers.length <= 0 && (
                        <div className="w-full flex items-center py-10 justify-center">
                            <CgSpinner size={30} className="animate-spin text-blue-500" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GitHubFollowerList;
