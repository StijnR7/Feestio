import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import "./header.css";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);

        // Optional: Save user profile to Firestore
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(
          userRef,
          {
            email: currentUser.email,
            displayName: currentUser.displayName || "",
          },
          { merge: true }
        );
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <header>
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          {!user && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          {user && (
            <>
              <li>
                <Link
                  to={`/account/${user.uid}`}
                  state={{
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                  }}
                >
                  Account
                </Link>
              </li>
              <li>
                <Link to="/friends">Friends</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
