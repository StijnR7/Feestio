import './partyDetails.css';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router'; // Keep this if you're using params
import { useEffect, useState } from 'react';
import { getDocs, collection, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

function PartyDetails() {
  const location = useLocation();
  const { party, uid } = location.state || {};
  const {user, setUser} = useState(localStorage.getItem("user"));
  if (!party) {
    return <div>Error: No party data provided.</div>;
  }

  return (
    <>
      <div>{user?.uid}</div>
      <div>Title: {party.Title}</div>
      <div>Location: {party.Location}</div>
      <div>Start Time: {party.StartTime}</div>
      <div>End Time: {party.EndTime}</div>
      <img src={party.ImageURL} alt={party.Title} />
    </>
  );
}

export default PartyDetails;
