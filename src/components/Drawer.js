import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LogoutIcon from "@mui/icons-material/Logout";
import clsx from "clsx";
import {useUser} from "../context/UserContext";

export default function Drawer({isOpen, setDrawerOpen}) {
    const {signOut} = useUser();
    console.log(isOpen);
    return (
        <div
            className={clsx(
                "fixed left-0 top-0 bg-secondary-300 h-screen flex flex-col gap-3 overflow-hidden transition-all duration-300",
                isOpen ? "w-60 px-6" : "w-0 px-0"
            )}
        >
            <div
                onClick={() => setDrawerOpen(false)}
                className="mt-7 self-end hover:bg-secondary-100 hover:bg-opacity-55 active:bg-opacity-100 rounded-full p-2"
            >
                <ArrowBackIosNewIcon className="text-primary-100" />
            </div>

            <div className="flex items-center gap-2 text-primary-100 hover:bg-secondary-100 hover:bg-opacity-55 active:bg-opacity-100 p-2 rounded-md">
                <LogoutIcon fontSize="small" />
                <button onClick={() => signOut()}>help</button>
            </div>

            <div className="flex items-center gap-2 text-primary-100 hover:bg-secondary-100 hover:bg-opacity-55 active:bg-opacity-100 p-2 rounded-md">
                <LogoutIcon fontSize="small" />
                <button onClick={() => signOut()}>logout</button>
            </div>
        </div>
    );
}
