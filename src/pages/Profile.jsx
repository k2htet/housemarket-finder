import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import {
    updateDoc,
    doc,
    collection,
    getDocs,
    query,
    orderBy,
    where,
    deleteDoc,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

const Profile = () => {
    const auth = getAuth();

    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    const { name, email } = formData;
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, "listings");
            const q = query(
                listingsRef,
                where("userRef", "==", auth.currentUser.uid),
                orderBy("timestamp", "desc")
            );

            const snap = await getDocs(q);
            let listings = [];

            snap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            setListings(listings);
            setLoading(false);
        };

        fetchUserListings();
    }, [auth.currentUser.uid]);

    const onDelete = async (listingId) => {
        if (window.confirm("Are you sure want to delete?")) {
            await deleteDoc(doc(db, "listings", listingId));
            const updateListing = listings.filter(
                (listing) => listing.id !== listingId
            );
            setListings(updateListing);
            toast.success("Successfuly Deleted");
        }
    };

    const handleLogout = () => {
        auth.signOut();
        navigate("/");
    };

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                // update display name in fb auth
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });

                // update in firestore
                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, { name });
            }
        } catch (error) {
            toast.error("Could not update profile details!");
        }
    };

    const onChange = ({ target }) => {
        setFormData((prevState) => ({
            ...prevState,
            [target.id]: target.value,
        }));
    };

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);
    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type="button" className="logOut" onClick={handleLogout}>
                    Logout
                </button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>

                    <p
                        className="changePersonalDetails"
                        onClick={() => {
                            changeDetails && onSubmit();
                            setChangeDetails((prevState) => !prevState);
                        }}
                    >
                        {changeDetails ? "done" : "change"}
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input
                            type="text"
                            id="name"
                            className={
                                !changeDetails
                                    ? "profileName"
                                    : "profileNameActive"
                            }
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input
                            type="email"
                            id="email"
                            className={
                                !changeDetails
                                    ? "profileEmail"
                                    : "profileEmailActive"
                            }
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>

                <Link to="/create-listing" className="createListing">
                    <img src={homeIcon} alt="home" />
                    <p>Sell or Rent your home</p>
                    <img src={arrowRight} alt="arrow right" />
                </Link>

                {!loading && listings?.length > 0 && (
                    <>
                        <p className="listingText">Your Listings</p>
                        <ul className="listingsList">
                            {listings.map((listing) => {
                                return (
                                    <ListingItem
                                        key={listing.id}
                                        listing={listing.data}
                                        id={listing.id}
                                        onDelete={() => onDelete(listing.id)}
                                        onEdit={() => onEdit(listing.id)}
                                    />
                                );
                            })}
                        </ul>
                    </>
                )}
            </main>
        </div>
    );
};

export default Profile;
