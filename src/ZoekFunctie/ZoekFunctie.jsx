import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import supabase from "../config/supabase";


function ZoekFunctie(){
    return(<>
    
        <input type="text" onChange={console.log("Changed")} />
    
    </>)
}

export default ZoekFunctie;