import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useUser} from "../context/UserContext";
import {Form} from "react-router-dom";
import clsx from "clsx";

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const {signUp} = useUser();

    const handleSignUp = (ev) => {
        ev.preventDefault();
        setLoading(true);
        signUp(email, password, setError).then((signed_up) => {
            if (signed_up) navigate("/");
            setLoading(false);
        });
    };

    // jass@gmail.com
    // aaaaaa

    return (
        <div className="bg-secondary-200 flex-col h-screen flex justify-center items-center">
            <form
                onSubmit={(ev) => handleSignUp(ev)}
                className="w-full max-w-screen-sm flex flex-col p-6"
            >
                <fieldset className="flex flex-col border rounded-xl px-7 border-secondary-100">
                    <h2 className="text-center text-primary-100 text-3xl mb-8 mt-12">
                        Sign up
                    </h2>

                    {error && (
                        <div className="bg-red-300 px-2 py-2 rounded-xl mb-2">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

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

                    <label htmlFor="password" className="text-primary-100 mb-2">
                        Password Confirmation
                    </label>
                    <input
                        className="bg-transparent border rounded-md flex-1 px-3 py-2 outline-none border-secondary-100 text-white focus:border-white mb-4"
                        id="password"
                        name="password"
                        value={passwordConfirmation}
                        onChange={(ev) =>
                            setPasswordConfirmation(ev.target.value)
                        }
                        placeholder="Password Confirmation"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={clsx(
                            "bg-accent text-primary-100 rounded-md px-3 py-2 mb-4 hover:bg-opacity-70 active:bg-opacity-40"
                        )}
                    >
                        Sign up
                    </button>
                </fieldset>
                <p className="text-center text-primary-100">
                    Already have an account?{" "}
                    <Link
                        to="/signin"
                        className="text-accent hover:text-opacity-70 active:text-opacity-40"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
}
