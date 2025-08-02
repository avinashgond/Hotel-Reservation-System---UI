import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [rooms, setRooms] = useState([]);
  const [roomCount, setRoomCount] = useState(1);
  const [message, setMessage] = useState('');

  const fetchRooms = async () => {
    const res = await axios.get('https://hrs-yj2n.onrender.com/shivaji-hotel/available-rooms');
    setRooms(res.data);
  };

  const addRoom = async () => {
    const res = await axios.post('https://hrs-yj2n.onrender.com/shivaji-hotel/add-room');
    fetchRooms();
  };

  useEffect(() => {
    fetchRooms();
  }, []);


  const handleBook = async () => {
    try {
      const res = await axios.post(`https://hrs-yj2n.onrender.com/shivaji-hotel/book-room/${roomCount}`);
      setMessage(`Booked ${res.data.length} room(s) successfully.`);
      fetchRooms();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed. Only 5 rooms allowed');
    }
  };


  const handleRandom = async () => {
    await axios.post('https://hrs-yj2n.onrender.com/shivaji-hotel/rooms/random-occupancy');
    setMessage('Random occupancy generated.');
    fetchRooms();
  };

  const handleReset = async () => {
    await axios.post('https://hrs-yj2n.onrender.com/shivaji-hotel/rooms/reset');
    setMessage('All bookings reset.');
    fetchRooms();
  };

  const getRoomColor = (status) => {
    return status === 'BOOKED' ? 'grey' : 'lightgreen';
  };

  const groupedByFloor = rooms.reduce((acc, room) => {
    acc[room.floors] = acc[room.floors] || [];
    acc[room.floors].push(room);
    return acc;
  }, {});

  const sortedFloors = Object.entries(groupedByFloor).sort(
    (a, b) => parseInt(b[0].replace(/\D/g, '')) - parseInt(a[0].replace(/\D/g, ''))
  );

  return (
    <div className="App">
      <h1>Hotel Room Reservation</h1>

      <div className="top-bar">
      <label htmlFor="roomCountInput">No. of rooms:</label>
        <input
          type="number"
          min="1"
          max="5"
          value={roomCount}
          onChange={(e) => setRoomCount(e.target.value)}
          placeholder="No of Rooms"
        />
        <button onClick={handleBook}>Book</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleRandom}>Random</button>
        <button onClick={addRoom}>addRoom</button>
      </div>

      {/* {message && <p className="message">{message}</p>} */}
      {message && (
  <p className={`message ${message.toLowerCase().includes('failed') ? 'error' : 'success'}`}>
    {message}
  </p>
)}
<div className="main-container">
  {/* Left Side Panel */}
  <div className="side-panel left-panel">
    <h3>🏨 Hotel Structure & Booking Rules</h3>
    <p><strong>🏢 Hotel Layout</strong><br />
      The hotel has 97 rooms across 10 floors.<br />
      Floors 1–9: 10 rooms each (101–910)<br />
      Floor 10: 7 rooms (1001–1007)
    </p>
    <p><strong>🛗 Building Structure</strong><br />
      Lift & Stairs are on the left. Rooms go left to right on each floor.
    </p>
    <p><strong>⏱️ Room Proximity</strong><br />
      Horizontal: 1 min/room<br />
      Vertical: 2 mins/floor
    </p>
    <p><strong>📋 Booking Rules</strong><br />
      Max 5 rooms per booking.<br />
      Priority: same floor → least travel time
    </p>
  </div>

  {/* Center Room Grid */}
  <div className="room-grid">
    <div className="lift-stairs-box">
      <div className="lift-stairs-label">Lift / Stairs</div>
    </div>
    <div className="floors-column">
      {sortedFloors.map(([floor, floorRooms]) => (
        <div key={floor} className="floor-row">
          {floorRooms
            .sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber))
            .map((room) => (
              <div
                key={room.roomNumber}
                className="room-box"
                style={{ backgroundColor: getRoomColor(room.status) }}
              >
                {room.roomNumber}
              </div>
            ))}
        </div>
      ))}
    </div>
  </div>

  {/* Right Side Panel */}
  <div className="side-panel right-panel">
    <h3>📋 Instructions</h3>
    <ol>
      <li>Click <strong>addRoom</strong> if rooms are not showing</li>
      <li>Use <strong>Book, Reset, Random</strong> as needed</li>
    </ol>
    <p><strong>Room Color Legend:</strong></p>
    <ul>
      <li><span className="legend-box green"></span> Available</li>
      <li><span className="legend-box grey"></span> Booked</li>
    </ul>
  </div>
</div>

     
    </div>
  );
}

export default App;
