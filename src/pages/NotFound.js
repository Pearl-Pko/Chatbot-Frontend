import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col h-screen bg-secondary-200 justify-center items-center">
            <h1 className="text-primary-100 text-4xl mb-5">Not Found</h1>
            <p className="text-primary-100">The page you are looking for could not be found.</p>
            <p className="text-primary-100">Go to <Link to="/" className="text-accent hover:text-opacity-70 active:text-opacity-40">homepage</Link></p>
        </div>
    );
}
