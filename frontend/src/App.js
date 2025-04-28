import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [signs, setSigns] = useState([]);

  useEffect(() => {
    // Запрос к API при монтировании компонента
    const fetchSigns = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/signs/");
        if (response.ok) {
          const data = await response.json();
          setSigns(data); // Сохраняем данные в состояние
        } else {
          console.error("Error fetching signs:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSigns();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sign List</h1>
        <table>
          <thead>
            <tr>
              <th>GIBDD Unique ID</th>
              <th>Commerce Internal ID</th>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>GIBDD Description</th>
              <th>Commerce Description</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {signs.map((sign, index) => (
              <tr key={index}>
                <td>{sign.gibdd_unical_id}</td>
                <td>{sign.commerce_internal_id}</td>
                <td>{sign.name}</td>
                <td>{sign.latitude}</td>
                <td>{sign.longitude}</td>
                <td>{sign.gibdd_description}</td>
                <td>{sign.commerce_description}</td>
                <td>{sign.source}</td>
                <td>{sign.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
