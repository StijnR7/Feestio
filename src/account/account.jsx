import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { db, auth  } from "../config/firebase";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import "./account.css";
import supabase from "../config/supabase";
import Header from '../header/header'
import "./account.css";
function Account(){
    const [imageFile, setImageFile] = useState(null);
    const [registeredPartyList, setRegisteredPartyList] = useState([]);

    const location = useLocation();
    const account = location.state;
    const auth = getAuth();
 const handleLogout = async () => {
    signOut(auth).then(() => {console.log("signed out")}).catch((error) => {console.log("Not skibidi")});
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

 useEffect(() => {
    const getParty = async () => {
      const data = await getDocs(collection(db, "registrations"));
      setRegisteredPartyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getParty();
  }, []);
  
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

  const ShowFilteredRegistrations = () => {
  return (
    <>
      {}
    </>
  );
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

      <button onClick={handleLogout}>Log out</button>
      <ul>
        {registeredPartyList
        .filter((item) => item.uid === account.uid)
        .map((party) => (
          <div key={party.id}>{party.Title}</div>
        ))}
      </ul>
        </>

    )
}

export default Account;