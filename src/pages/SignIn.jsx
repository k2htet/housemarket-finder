import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

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
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (userCredential.user) {
                navigate("/");
            }
        } catch (error) {
            toast.error("Bad User Credential!");
        }
    };
    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>
                <form onSubmit={handleSubmit}>
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

                    <div className="signInBar">
                        <p className="singInText">Sign In</p>
                        <button className="signInButton">
                            <ArrowRightIcon
                                fill="#fff"
                                width="36px"
                                height="36px"
                            />
                        </button>
                    </div>
                </form>

                <OAuth />

                <Link to="/sign-up" className="registerLink">
                    Sign Up Instead
                </Link>
            </div>
        </>
    );
};

export default SignIn;
