import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [rooms, setRooms] = useState([]);
  const [roomCount, setRoomCount] = useState(1);
  const [message, setMessage] = useState('');

  const fetchRooms = async () => {
    const res = await axios.get('/available-rooms');
    setRooms(res.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleBook = async () => {
    try {
      const res = await axios.post(`/book-room/${roomCount}`);
      setMessage(`Booked ${res.data.length} room(s) successfully.`);
      fetchRooms();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed. Only 5 rooms allowed');
    }
  };
  

  const handleRandom = async () => {
    await axios.post('/rooms/random-occupancy');
    setMessage('Random occupancy generated.');
    fetchRooms();
  };

  const handleReset = async () => {
    await axios.post('/rooms/reset');
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
      </div>

      {/* {message && <p className="message">{message}</p>} */}
      {message && (
  <p className={`message ${message.toLowerCase().includes('failed') ? 'error' : 'success'}`}>
    {message}
  </p>
)}
        <div className="room-grid">
  {/* Single vertical lift box */}
  <div className="lift-stairs-box">
    <div className="lift-stairs-label">Lift / Stairs</div>
  </div>
 
  {/* Floors and rooms */}
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
              // className={`room-box ${room.status === 'BOOKED' ? 'booked' : ''}`}
            >
              {room.roomNumber}
            </div>
          ))}
      </div>
    ))}
  </div>
</div>
     
    </div>
  );
}

export default App;
