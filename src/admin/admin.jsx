import "./admin.css";
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

function Admin() {
  const [getPartyList, setPartyList] = useState([]);
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const getParty = async () => {
      const data = await getDocs(collection(db, "Party"));
      setPartyList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getParty();
  }, []);

  const DeleteItem = async (e) => {
    e.preventDefault();
    const itemID = e.target.value;
    await deleteDoc(doc(db, "Party", itemID));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const AddItem = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    await addDoc(collection(db, "Party"), {
      Title: e.target.Title.value,
      Location: e.target.Location.value,
      StartTime: e.target.StartTime.value,
      EndTime: e.target.EndTime.value,
      OrganizationID: 1,
      ImageURL: imageUrl,
      userUID: user.uid
    });
  };

  return (
    <>
      <p>Ingelogd als: {user?.displayName || user?.email}</p>
    
      <form onSubmit={AddItem}>
        <p>Title</p>
        <input placeholder="Party name" type="text" name="Title" />
        <p>Location</p>
        <input name="Location" type="text" />
        <p>Start Time</p>
        <input name="StartTime" type="datetime-local" />
        <p>End Time</p>
        <input name="EndTime" type="datetime-local" />
        <p>Image</p>
        <input type="file" onChange={handleImageChange} />
        <br />
        <button type="submit">go</button>
      </form>

      {getPartyList.map((Party) => (
        <div key={Party.id}>
          <h2>{Party.Title}</h2>
          {Party.ImageURL && <img src={Party.ImageURL} alt={Party.Title} style={{ width: 150 }} />}
          <Link to={`/party/${Party.Title}`} state={Party}>
            Details
          </Link>
          <button onClick={DeleteItem} value={Party.id}>
            Delete
          </button>
          <Link to={`./update/${Party.id}`} state={Party}>
            update
          </Link>
        </div>
      ))}
    </>
  );
}

export default Admin;
