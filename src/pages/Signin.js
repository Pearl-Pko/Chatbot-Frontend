import React, {useState} from "react";
import {Link, useNavigate, useNavigation} from "react-router-dom";
import {useUser} from "../context/UserContext";
import clsx from "clsx";

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {signIn} = useUser();
    const navigate = useNavigate();

    const handleSignIn = (ev) => {
        ev.preventDefault();
        setLoading(true);
        signIn(email, password, setError).then((signed_in) => {
            if (signed_in) navigate("/");
            setLoading(false);
        });
    };

    return (
        <div className="bg-secondary-200 flex-col h-dvh flex justify-center items-center">
            <form
                onSubmit={(ev) => handleSignIn(ev)}
                className="w-full max-w-screen-sm flex flex-col p-6"
            >
                <fieldset className="flex flex-col border rounded-xl px-7 border-secondary-100">
                    <h2 className="text-center text-primary-100 text-3xl mb-8 mt-12">
                        Sign in
                    </h2>

                    {error && <div className="bg-red-300 px-2 py-2 rounded-md mb-2">
                        <p className="text-red-800">{error}</p>
                    </div>}

                    <label htmlFor="email" className="text-primary-100 mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        placeholder="Email"
                        className="bg-transparent border rounded-md flex-1 px-3 py-2 outline-none border-secondary-100 text-white focus:border-white mb-4"
                    />

                    <label htmlFor="password" className="text-primary-100 mb-2">
                        Password
                    </label>
                    <input
                        className="bg-transparent border rounded-md flex-1 px-3 py-2 outline-none border-secondary-100 text-white focus:border-white mb-4"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        placeholder="Password"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={clsx("bg-accent text-primary-100 rounded-md px-3 py-2 mb-4 hover:bg-opacity-70 active:bg-opacity-40", loading && "opacity-30 cursor-not-allowed")}
                    >
                        Sign in
                    </button>
                </fieldset>
                <p className="text-center text-primary-100">
                    Need an account?{" "}
                    <Link
                        to="/signup"
                        className="text-accent hover:text-opacity-70 active:text-opacity-40"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
