import {
  getDocs,
  collection,
  addDoc
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Header from "../header/header";
import supabase  from "../config/supabase"; // Make sure this is set up

import "./account.css";

function Account() {
  const [imageFile, setImageFile] = useState(null);
  const [registeredPartyList, setRegisteredPartyList] = useState([]);

  const location = useLocation();
  const account = location.state;
  const auth = getAuth();

  const handleLogout = async () => {
    signOut(auth)
      .then(() => {
        console.log("signed out");
      })
      .catch((error) => {
        console.log("Error signing out:", error);
      });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  useEffect(() => {
    const getParty = async () => {
      const data = await getDocs(collection(db, "registrations"));
      setRegisteredPartyList(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getParty();
  }, []);

  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`; // Optional: organize into folders

    const { data, error } = await supabase.storage
      .from("images") // <-- replace with your Supabase bucket
      .upload(filePath, file);

    if (error) {
      console.error("Image upload error:", error.message);
      return "";
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    return urlData?.publicUrl || "";
  };

  const AddItem = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const private1 = e.target.isPrivate.checked;

    await addDoc(collection(db, "Party"), {
      Title: e.target.Title.value,
      Location: e.target.Location.value,
      StartTime: e.target.StartTime.value,
      EndTime: e.target.EndTime.value,
      OrganizationID: 1,
      ImageURL: imageUrl,
      isPrivate: private1,
      userUID: account.uid
    });
  };

  return (
    <>
      <Header />
      <div>{account.email}</div>

      <form onSubmit={AddItem}>
        <p>Title</p>
        <input placeholder="Party name" type="text" name="Title" required />
        <p>Location</p>
        <input name="Location" type="text" required />
        <p>Start Time</p>
        <input name="StartTime" type="datetime-local" required />
        <p>End Time</p>
        <input name="EndTime" type="datetime-local" required />
        <p>Image</p>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <p>Private</p>
        <input type="checkbox" name="isPrivate" />
        <button type="submit">Submit</button>
      </form>

      <button onClick={handleLogout}>Log out</button>

      <ul>
        {registeredPartyList
          .filter((item) => item.uid === account.uid)
          .map((party) => (
            <li key={party.id}>{party.Title}</li>
          ))}
      </ul>
    </>
  );
}

export default Account;
