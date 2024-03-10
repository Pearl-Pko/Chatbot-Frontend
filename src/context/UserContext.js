import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useReducer,
} from "react";
import {
    signOut as _signOut,
    updateProfile,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import {auth} from "../firebase";
import BlankPage from "../pages/BlankPage";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const initialState = {
    user: null,
};

const actionTypes = {
    SIGN_IN: "SIGN_IN",
    SIGN_UP: "SIGN_UP",
    SIGN_OUT: "SIGN_OUT",
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SIGN_IN:
            return {
                ...state,
                user: action.payload,
                isSignedIn: true,
            };
        case actionTypes.SIGN_UP:
            return {
                ...state,
                user: action.payload,
            };
        case actionTypes.SIGN_OUT:
            return initialState;
        default:
            return initialState;
    }
};

function getFirebaseAuthErrorMessage(errorMesssage) {
    return errorMesssage.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "");
}

export const UserProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(true);

    console.log(state);

    const signIn = async (email, password, displayError) => {
        console.log("yes");
        // const auth = getAuth();
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("signed in");
                const user = userCredential.user;
                dispatch({type: actionTypes.SIGN_IN, payload: user.uid});
                return true;
            })
            .catch((error) => {
                if (!email) return displayError("Email field is empty");
                if (!password) return displayError("Password field is empty");
                if (error.code === "auth/invalid-email")
                    return displayError(
                        "The email address is badly formatted."
                    );
                displayError("Failed to sign in");
                console.log(error.code);
            });
        // .catch((error) => {
        //     console.log(error);
        //     // displayError(getFirebaseAuthErrorMessage(error.message));
        //     // dummy email daddd@gmail.com dummy password aaaaaa
        //     // freshprince@gmail.com bbbbbbb
        // });
    };

    const signUp = async (email, password, displayError) => {
        // const user = "pearl";
        // console.log(userName);
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("signed up");
                const user = userCredential.user;
                dispatch({type: actionTypes.SIGN_UP, payload: user.uid});
                return true;
            })
            .catch((error) => {
                if (!email) return displayError("Email field is empty");
                if (!password) return displayError("Password field is empty");
                if (error.code === "auth/invalid-email")
                    return displayError(
                        "The email address is badly formatted."
                    );
                if (error.code === "auth/weak-password")
                    return displayError(
                        "The password must be 6 characters long or more."
                    );
                if (error.code === "auth/email-already-in-use")
                    return displayError(
                        "The email is already in use by another account."
                    );
                console.log(error.code);

                displayError("Failed to sign up");
            });
    };

    const onSignUpComplete = () => {
        dispatch({type: actionTypes.SIGN_IN, payload: state.user});
    };

    const signOut = () => {
        _signOut(auth)
            .then(() => {
                dispatch({type: actionTypes.SIGN_OUT});
            })
            .catch(() => {});

        // console.log(state.isSignedIn);
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("yes");
                dispatch({type: actionTypes.SIGN_IN, payload: user.uid});
                console.log(state.user);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return loading ? (
        <BlankPage />
    ) : (
        <UserContext.Provider value={{state, signIn, signUp}}>
            {children}
        </UserContext.Provider>
    );
};
