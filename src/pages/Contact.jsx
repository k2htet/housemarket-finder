import { useState, useEffect } from "react";

import { Link, useParams, useSearchParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

const Contact = () => {
    const [message, setMessage] = useState("");
    const [landlord, setlandlord] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useParams();

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, "users", params.landlordId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setlandlord(docSnap.data());
            } else {
                toast.error("could not get landlord data");
            }
        };

        getLandlord();
    }, [params.landlordId]);

    const onChange = ({ target }) => setMessage(target.value);

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Contact</p>
            </header>
            {landlord !== null && (
                <main>
                    <div className="contactLandlord">
                        <p className="landlordName">Contact {landlord?.name}</p>
                    </div>
                    <form className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel">
                                Message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                className="textarea"
                                value={message}
                                onChange={onChange}
                            ></textarea>
                        </div>
                        <a
                            href={`mailto:${
                                landlord.email
                            }?Subject=${searchParams.get(
                                "listingName"
                            )}&body=${message}`}
                        >
                            <button type="button" className="primaryButton">
                                Send Message
                            </button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    );
};

export default Contact;
