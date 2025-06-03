
import './admin.css'
import {getDocs, collection, doc, addDoc, deleteDoc, updateDoc} from 'firebase/firestore'
import PartyDetails from '../partyDetails/partyDetails';
import { db } from '../config/firebase';
import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
function Admin() {
    const [getPartyList, setPartyList] = useState([]);

    const  DeleteItem = async (e) => {
        e.preventDefault();
        const itemID = e.target.value;
        await deleteDoc(doc(db, "Party", itemID))


    }
    const UpdateItem = async (e) => {
        e.preventDefault();
        


    }

    const  AddItem = async (e) => {
        e.preventDefault(); 
        const docRef = await addDoc(collection(db, "Party"), {
        Title: e.target.Title.value,
        Location: e.target.Location.value,
        StartTime: e.target.StartTime.value,
        EndTime: e.target.EndTime.value,
        OrganizationID: 1
        });

    }
    useEffect(()=>{
        const getParty = async () => {
            const data = await getDocs(collection(db, "Party"));
            setPartyList(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        getParty();
    },[])

    return (
        <>
           
         
            <form onSubmit={AddItem}>
                    <p>
                        Title
                    </p>
                    <input placeholder='Party name' type="text" name="Title"  />
                    <p>
                        Location
                    </p>
                    <input name="Location" type="text" />
                    <p>
                        Start Time
                    </p>
                   
                    <input name="StartTime" type="datetime-local" />
                    <p>
                        End Time
                    </p>
                    <input name="EndTime" type="datetime-local" />
                   <br />
                    <button type="submit">go</button>
            </form>
            {getPartyList.map(Party => {
                
                return (
                    <>
                    <h2 key={Party.id}>{Party.Title}</h2>
                    <Link to={`/party/${Party.Title}`} state={Party}>ohi</Link>
                    <button onClick={DeleteItem} value={Party.id}>Delete</button>
                         <Link to={`./update/${Party.id}`} state={Party}>update</Link>
                    </>
                )
            })}
        </>
    )

}

export default Admin