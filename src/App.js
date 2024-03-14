import React from "react";
import {Routes, Route, Navigate} from "react-router";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import { useUser } from "./context/UserContext";
import { auth } from "./firebase";

export default function App() {
    const {state} = useUser();

    // console.log("auth current user", auth.currentUser);

    return (
        <Routes>
            <Route path="/signup" element={(!state.user) ? <Signup /> : <Navigate to="/"/>} />
            <Route path="/signin" element={(!state.user) ? <Signin /> : <Navigate to="/"/>} />
            <Route path="/" element={(state.user) ? <Home /> : <Navigate to="/signin"/>} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
