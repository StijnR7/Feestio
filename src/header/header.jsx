import "./header.css";
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
import "./header.css";


function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <header>
      <nav>
        <ul className="">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          {user && (
            <li><Link to={`/account/${user.uid}`}   
            state={{
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    }}
    >Account</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
