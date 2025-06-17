import "./home.css";
import {
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Header from '../header/header';

function Home() {
  const location = useLocation();
  const uid = location.state?.id || null;

  const [getPartyList, setPartyList] = useState([]);
  const [filter, setFilter] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setFilter(e.target.value.trim());
  };

  useEffect(() => {
    const getParty = async () => {
      const data = await getDocs(collection(db, "Party"));
      setPartyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getParty();
  }, []);

  return (
    <>
      <Header />
      <input type="text" onChange={handleChange} placeholder="Search" />
      <div className="postContainer">
        {getPartyList
          .filter((item) => item.Title.toLowerCase().includes(filter.toLowerCase()))
          .map((Party) => (
            <div className="outerPost" key={Party.id}>
              <div className="titleContainer">
                <h2>{Party.Title}</h2>
              </div>
              <div className="dataContainer">
                <p>Location: {Party.Location}</p>
                <p>Start time: {Party.StartTime}</p>
                <p>End Time: {Party.EndTime}</p>

                <Link to={`/party/${Party.Title}`} state={{ party: Party, id: uid }}>
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
