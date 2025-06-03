import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

function Update() {
  const { id } = useParams();
  const location = useLocation();
  const party = location.state;

  const [title, setTitle] = useState(party?.Title || '');
  const [locationName, setLocationName] = useState(party?.Location || '');
  const [startTime, setStartTime] = useState(party?.StartTime || '');
  const [endTime, setEndTime] = useState(party?.EndTime || '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'Party', id), {
      Title: title,
      Location: locationName,
      StartTime: startTime,
      EndTime: endTime,
    });
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Update Party</h2>
      <p>Title</p>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <p>Location</p>
      <input value={locationName} onChange={(e) => setLocationName(e.target.value)} />
      <p>Start Time</p>
      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <p>End Time</p>
      <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      <br />
      <button type="submit">Save</button>
    </form>
  );
}

export default Update;
