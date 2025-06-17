import "./home.css";
import {
  getDocs,
  collection,
  query,
  where
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from '../header/header';
import { getAuth } from "firebase/auth";
function Home() {
  const location = useLocation();
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid || null;

  const [getPartyList, setPartyList] = useState([]);
  const [filter, setFilter] = useState("");
  const [visiblePrivateParties, setVisiblePrivateParties] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    setFilter(e.target.value.trim());
  };

  const isFriend = async (userUid, posterUid) => {
    if (!userUid || !posterUid) return false;

    const q1 = query(
      collection(db, "friendRequests"),
      where("from", "==", userUid),
      where("to", "==", posterUid),
      where("status", "==", "accepted")
    );

    const q2 = query(
      collection(db, "friendRequests"),
      where("from", "==", posterUid),
      where("to", "==", userUid),
      where("status", "==", "accepted")
    );

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const friendResult = !snap1.empty || !snap2.empty;

    console.log(`Friend check between ${userUid} and ${posterUid}: ${friendResult}`);
    return friendResult;
  };

  useEffect(() => {
    const getParty = async () => {
      const data = await getDocs(collection(db, "Party"));
      const parties = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log("Fetched parties:", parties);
      setPartyList(parties);
    };
    getParty();
  }, []);

  useEffect(() => {
    const checkPrivateParties = async () => {
      const privateFiltered = getPartyList.filter(
        (item) =>
          item.isPrivate &&
          item.Title.toLowerCase().includes(filter.toLowerCase())
      );

      console.log("Filtered private parties to check:", privateFiltered);

      const visible = [];

      for (const item of privateFiltered) {
        if (!item.userUID) {
          console.warn("Party missing userUID:", item);
          continue;
        }
        console.log(`Checking party: ${item.Title} with userUID: ${item.userUID}`);

        const friend = await isFriend(uid, item.userUID);
        console.log(`Friend check between ${uid} and ${item.userUID}: ${friend}`);

        if (friend) visible.push(item);
      }

      console.log("Visible private parties after friend checks:", visible);
      setVisiblePrivateParties(visible);
    };

    if (uid && getPartyList.length > 0) {
      (async () => {
        await checkPrivateParties();
      })();
    }
  }, [filter, getPartyList, uid]);

  console.log("Current user UID:", uid);

  return (
    <>
      <Header />
      <input type="text" onChange={handleChange} placeholder="Search" />

      <div className="postContainer">
        {/* Public parties */}
        {getPartyList
          .filter((item) =>
            item.Title.toLowerCase().includes(filter.toLowerCase())
          )
          .filter((item) => !item.isPrivate)
          .map((Party) => (
            <div className="outerPost" key={Party.id}>
              <div className="titleContainer">
                <h2>{Party.Title}</h2>
              </div>
              <div className="dataContainer">
                <p>Location: {Party.Location}</p>
                <p>Start time: {Party.StartTime}</p>
                <p>End Time: {Party.EndTime}</p>

                <Link to={`/party/${Party.Title}`} state={Party}>
                  Details
                </Link>
              </div>
            </div>
          ))}

        {/* Private parties - shown only if user is a friend of poster */}
        {visiblePrivateParties.map((Party) => (
          <div className="outerPost" key={Party.id}>
            <div className="titleContainer">
              <h2>{Party.Title}</h2>
            </div>
            <div className="dataContainer">
              <p>Location: {Party.Location}</p>
              <p>Start time: {Party.StartTime}</p>
              <p>End Time: {Party.EndTime}</p>

              <Link to={`/party/${Party.Title}`} state={Party}>
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
