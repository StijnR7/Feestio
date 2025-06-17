import "./home.css";
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
import Header from '../header/header'
function Home(){
    const [getPartyList, setPartyList] = useState([]);
    const [filter, setFilter] = useState("")
    const HandleChange = (e) => {
        e.preventDefault();
        
        const search = e.target.value.trim();
        setFilter(search)


    }
    useEffect(() => {
    const getParty = async () => {
      const data = await getDocs(collection(db, "Party"));
      setPartyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getParty();
  }, []);
return(

    <>
    <Header/>
  <input type="text" onChange={HandleChange} placeholder="Search" />
    <div className="postContainer">
    {getPartyList.filter((item) => item.Title.includes(filter)).map((Party)      => (
        
        <div className="outerPost">
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
)

}

export default Home;