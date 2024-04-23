import React, {useState} from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "./Drawer";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
export default function AppNavigation() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="container bg-secondary-200">
            <div className="h-12 bg-secondary-100 flex justify-center items-center text-lg text-white header">
                <button
                    className="absolute left-3"
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon />
                </button>
                <Link to="/">KoFiBot</Link>
                {/* <p>KoFIBot</p> */}
            </div>
            <Drawer isOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            <Outlet/>
        </div>
    );
}
