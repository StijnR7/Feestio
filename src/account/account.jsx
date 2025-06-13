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

function Account(){
    const location = useLocation();
    const account = location.state;


    return(
        <>{account.displayName}</>

    )
}

export default Account;