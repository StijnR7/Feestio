import { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import Header from "../header/header";

function Friends() {
  const [email, setEmail] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
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

  const fetchRequests = async (uid) => {
    const sentQuery = query(
      collection(db, "friendRequests"),
      where("from", "==", uid)
    );
    const sentSnapshot = await getDocs(sentQuery);
    setSentRequests(
      sentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );

    const receivedQuery = query(
      collection(db, "friendRequests"),
      where("to", "==", uid)
    );
    const receivedSnapshot = await getDocs(receivedQuery);
    setReceivedRequests(
      receivedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const sendRequest = async () => {
    if (!user || !email) return;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("No user found with that email.");
      return;
    }

    const toUser = querySnapshot.docs[0].id;

    if (toUser === user.uid) {
      alert("You can't send a request to yourself.");
      return;
    }

    const existing = query(
      collection(db, "friendRequests"),
      where("from", "==", user.uid),
      where("to", "==", toUser)
    );
    const existingSnap = await getDocs(existing);
    if (!existingSnap.empty) {
      alert("Friend request already sent.");
      return;
    }

    await addDoc(collection(db, "friendRequests"), {
      from: user.uid,
      to: toUser,
      status: "pending",
      createdAt: new Date(),
    });

    setEmail("");
    fetchRequests(user.uid);
    alert("Friend request sent!");
  };

  const acceptRequest = async (requestId) => {
    const requestRef = doc(db, "friendRequests", requestId);
    await updateDoc(requestRef, {
      status: "accepted",
    });

    fetchRequests(user.uid);
  };

  const rejectRequest = async (requestId) => {
    const requestRef = doc(db, "friendRequests", requestId);
    await updateDoc(requestRef, {
      status: "rejected",
    });

    fetchRequests(user.uid);
  };

  return (
    <>
      <Header />

      <div>
        <h1>Friends Page</h1>

        <div>
          <input
            type="email"
            value={email}
            placeholder="Friend's Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendRequest}>Send Friend Request</button>
        </div>

        <hr />

        <h2>Incoming Requests</h2>
        <ul>
          {receivedRequests.map((req) => (
            <li key={req.id}>
              From: {req.from} — Status: {req.status}
              {req.status === "pending" && (
                <>
                  <button onClick={() => acceptRequest(req.id)}>Accept</button>
                  <button onClick={() => rejectRequest(req.id)}>Reject</button>
                </>
              )}
            </li>
          ))}
        </ul>

        <h2>Sent Requests</h2>
        <ul>
          {sentRequests.map((req) => (
            <li key={req.id}>
              To: {req.to} — Status: {req.status}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Friends;
