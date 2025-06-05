import "./admin.css";
import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth, googleProvider } from "../config/firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { signInWithPopup } from "firebase/auth";

function Admin() {
  const [getPartyList, setPartyList] = useState([]);
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      console.log("Ingelogd als:", result.user.displayName);
    } catch (error) {
      console.error("Login mislukt:", error.message);
    }
    
  };

  const DeleteItem = async (e) => {
    e.preventDefault();
    const itemID = e.target.value;
    await deleteDoc(doc(db, "Party", itemID));
  };

  const UpdateItem = async (e) => {
    e.preventDefault();
    // Update logica hier toevoegen indien nodig
  };

  const AddItem = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "Party"), {
      Title: e.target.Title.value,
      Location: e.target.Location.value,
      StartTime: e.target.StartTime.value,
      EndTime: e.target.EndTime.value,
      OrganizationID: 1,
    });
  };

  useEffect(() => {
    const getParty = async () => {
      const data = await getDocs(collection(db, "Party"));
      setPartyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getParty();
  }, []);

  return (
    <>
        
      <button onClick={handleGoogleLogin}>Log in met Google</button>
      {user && <p>Ingelogd als: {user.displayName}</p>}

      <form onSubmit={AddItem}>
        <p>Title</p>
        <input placeholder="Party name" type="text" name="Title" />
        <p>Location</p>
        <input name="Location" type="text" />
        <p>Start Time</p>
        <input name="StartTime" type="datetime-local" />
        <p>End Time</p>
        <input name="EndTime" type="datetime-local" />
        <br />
        <button type="submit">go</button>
      </form>

      {getPartyList.map((Party) => (
        <div key={Party.id}>
          <h2>{Party.Title}</h2>
          <Link to={`/party/${Party.Title}`} state={Party}>
            ohi
          </Link>
          <button onClick={DeleteItem} value={Party.id}>
            Delete
          </button>
          <Link to={`./update/${Party.id}`} state={Party}>
            update
          </Link>
        </div>
      ))}
    </>
  );
}

export default Admin;
