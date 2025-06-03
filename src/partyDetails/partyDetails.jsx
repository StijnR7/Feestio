
import './partyDetails.css'
import {getDocs, collection, doc, addDoc, deleteDoc, updateDoc} from 'firebase/firestore'
import { db } from '../config/firebase';
import {useEffect, useState} from "react";
import { useParams } from 'react-router';
import { useLocation } from 'react-router';
function partyDetails() {
   
  const location = useLocation();  
  const party = location.state;

    return (
        <>
          Title: {party.Title} <br />
          Location: {party.Location} <br />
          Start Time: {party.StartTime} <br />
          End Time: {party.EndTime}
         
        </>
    )

}

export default partyDetails