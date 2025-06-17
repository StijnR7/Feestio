import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import "./account.css";
import supabase from "../config/supabase";
import Header from '../header/header'
import "./account.css";
function Account(){
    const [imageFile, setImageFile] = useState(null);
    const location = useLocation();
    const account = location.state;
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const AddItem = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    await addDoc(collection(db, "Party"), {
      Title: e.target.Title.value,
      Location: e.target.Location.value,
      StartTime: e.target.StartTime.value,
      EndTime: e.target.EndTime.value,
      OrganizationID: 1,
      ImageURL: imageUrl,
      userUID: account.uid
    });
  };

    return(

        <>
         <Header/>
        {account.email}
        
        
      <form onSubmit={AddItem}>
        <p>Title</p>
        <input placeholder="Party name" type="text" name="Title" />
        <p>Location</p>
        <input name="Location" type="text" />
        <p>Start Time</p>
        <input name="StartTime" type="datetime-local" />
        <p>End Time</p>
        <input name="EndTime" type="datetime-local" />
        <p>Image</p>
        <input type="file" onChange={handleImageChange} />
        <br />
        <button type="submit">go</button>
      </form>
        </>

    )
}

export default Account;