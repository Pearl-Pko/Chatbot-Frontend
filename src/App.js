import React from "react";
import {Routes, Route, Navigate} from "react-router";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import {useUser} from "./context/UserContext";
import {auth} from "./firebase";
import ProtectedRoute from "./components/ProtectedRoute";
import AppNavigation from "./components/AppNavigation";

export default function App() {
    const {state} = useUser();

    // console.log("auth current user", auth.currentUser);

    return (
        <Routes>
            <Route
                path="/signup"
                element={!state.user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
                path="/signin"
                element={!state.user ? <Signin /> : <Navigate to="/" />}
            />
            <Route path="/" element={<ProtectedRoute />}>
                <Route path="/" element={<AppNavigation />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/help" element={<Help />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
