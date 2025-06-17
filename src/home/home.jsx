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

function Home() {
  const location = useLocation();
  const uid = location.state?.id || null;

  const [getPartyList, setPartyList] = useState([]);
  const [filter, setFilter] = useState("");
  const [visiblePrivateParties, setVisiblePrivateParties] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    setFilter(e.target.value.trim());
  };

  const isFriend = async (userUid, posterUid) => {
    if (!userUid || !posterUid) return false;

    const q = query(
      collection(db, "friendRequests"),
      where("status", "==", "accepted"),
      where("from", "in", [userUid, posterUid]),
      where("to", "in", [userUid, posterUid])
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  useEffect(() => {
    const getParty = async () => {
      const data = await getDocs(collection(db, "Party"));
      setPartyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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

      const visible = [];

      for (const item of privateFiltered) {
        const friend = await isFriend(uid, item.uid);
        if (friend) visible.push(item);
      }

      setVisiblePrivateParties(visible);
    };

    if (uid) {
      checkPrivateParties();
    }
  }, [filter, getPartyList, uid]);

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

        {/* Private parties (only show if user is a friend of the poster) */}
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
