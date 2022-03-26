import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = formData;

    const navigate = useNavigate();

    const handleChange = ({ target }) => {
        setFormData((prevState) => ({
            ...prevState,
            [target.id]: target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            updateProfile(auth.currentUser, {
                displayName: name,
            });

            const formDataCopy = { ...formData };
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            await setDoc(doc(db, "users", user.uid), formDataCopy);

            navigate("/");
        } catch (error) {
            toast.error("Something went wrong with registration!");
        }
    };

    return (
        <>
            <div className="pageContainer">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="nameInput"
                        id="name"
                        value={name}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    <input
                        type="email"
                        className="emailInput"
                        id="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    <div className="passwordInputDiv">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="passwordInput"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                        />
                        <img
                            src={visibilityIcon}
                            className="showPassword"
                            alt="Show Password"
                            onClick={() =>
                                setShowPassword((prevState) => !prevState)
                            }
                        />
                    </div>
                    <Link to="/forgot-password" className="forgotPasswordLink">
                        Forgot Password
                    </Link>

                    <div className="signUpBar">
                        <p className="singUpText">Sign Up</p>
                        <button className="signUpButton">
                            <ArrowRightIcon
                                fill="#fff"
                                width="36px"
                                height="36px"
                            />
                        </button>
                    </div>
                </form>
                <OAuth />

                <Link to="/sign-in" className="registerLink">
                    Sign In Instead
                </Link>
            </div>
        </>
    );
};

export default SignUp;
