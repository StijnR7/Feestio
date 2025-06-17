import './partyDetails.css'
import {useState, useEffect} from 'react';
import { useLocation,} from 'react-router';
import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
function PartyDetails() {
  const location = useLocation();  
  const party = location.state;
  const [user, setUser] = useState(null);

 useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchRequests(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const Register = async (e) => {
    e.preventDefault();


    await addDoc(collection(db, "registrations"), {
      partyID: party.id,
      uid: user.uid,
      Title: party.Title
      
    });
  };

  return (

    <div className="party-container">
      
      <h2>{party.Title}</h2>
      <p><strong>Location:</strong> {party.Location}</p>
      <p><strong>Start:</strong> {party.StartTime}</p>
      <p><strong>End:</strong> {party.EndTime}</p>
      {party.ImageURL && (
        <img src={party.ImageURL} alt={party.Title} />
      )}
      <button onClick={Register}>Register</button>
    </div>
  );
}

export default PartyDetails;
