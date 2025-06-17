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
  or,
} from "firebase/firestore";
import Header from "../header/header";

function Friends() {
  const [email, setEmail] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
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
    // verzoeken versturn
    const sentQuery = query(
      collection(db, "friendRequests"),
      where("from", "==", uid)
    );
    const sentSnapshot = await getDocs(sentQuery);
    const sent = sentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSentRequests(sent);

    // verzoek krijgen 
    const receivedQuery = query(
      collection(db, "friendRequests"),
      where("to", "==", uid)
    );
    const receivedSnapshot = await getDocs(receivedQuery);
    const received = receivedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setReceivedRequests(received);

    // status van vrienden acepteren
    const acceptedQuery = query(
      collection(db, "friendRequests"),
      or(
        where("from", "==", uid),
        where("to", "==", uid)
      )
    );
    const acceptedSnapshot = await getDocs(acceptedQuery);
    const accepted = acceptedSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((req) => req.status === "accepted");
    setAcceptedFriends(accepted);
  };

  const sendRequest = async () => {
    if (!user || !email) return;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Geen gebruiker gevonden met dat e-mailadres.");
      return;
    }

    const toUser = querySnapshot.docs[0].id;

    if (toUser === user.uid) {
      alert("Je kunt geen verzoek naar jezelf sturen.");
      return;
    }

    const existing = query(
      collection(db, "friendRequests"),
      where("from", "==", user.uid),
      where("to", "==", toUser)
    );
    const existingSnap = await getDocs(existing);
    if (!existingSnap.empty) {
      alert("Vriendschapsverzoek al verstuurd.");
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
    alert("Vriendschapsverzoek verzonden!");
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

      <div style={{ padding: "20px" }}>
        <h1>Friends Page</h1>

        <div>
          <input
            type="email"
            value={email}
            placeholder="Vriend's e-mailadres"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendRequest}>Verstuur verzoek</button>
        </div>

        <hr />

        <h2>Ontvangen verzoeken</h2>
        <ul>
          {receivedRequests
            .filter((req) => req.status === "pending")
            .map((req) => (
              <li key={req.id}>
                Van: {req.from} — Status: {req.status}
                <button onClick={() => acceptRequest(req.id)}>Accepteren</button>
                <button onClick={() => rejectRequest(req.id)}>Weigeren</button>
              </li>
            ))}
        </ul>

        <h2>Verstuurde verzoeken</h2>
        <ul>
          {sentRequests.map((req) => (
            <li key={req.id}>
              Naar: {req.to} — Status: {req.status}
            </li>
          ))}
        </ul>

        <h2>Friends</h2>
        <ul>
          {acceptedFriends.map((friend) => {
            const friendId = friend.from === user.uid ? friend.to : friend.from;
            return <li key={friend.id}>user UID: {friendId}</li>;
          })}
        </ul>
      </div>
    </>
  );
}

export default Friends;
