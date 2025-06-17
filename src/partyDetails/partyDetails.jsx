import './partyDetails.css'
import { useLocation } from 'react-router';

function PartyDetails() {
  const location = useLocation();  
  const party = location.state;

  return (
    <div className="party-container">
      <h2>{party.Title}</h2>
      <p><strong>Location:</strong> {party.Location}</p>
      <p><strong>Start:</strong> {party.StartTime}</p>
      <p><strong>End:</strong> {party.EndTime}</p>
      {party.ImageURL && (
        <img src={party.ImageURL} alt={party.Title} />
      )}
    </div>
  );
}

export default PartyDetails;
