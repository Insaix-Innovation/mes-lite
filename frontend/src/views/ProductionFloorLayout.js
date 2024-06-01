// ProductionFloorLayout.js
import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import pflImage from "../assets/img/pfl.png";

const ImageWithLabels = () => {
  const [machineStatuses, setMachineStatuses] = useState([
    { id: 1, machine_status: 5 }
  ]);

  const imageRef = useRef(null); // Create a ref for the image

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/getMachineStatus')
        .then((response) => response.json())
        .then((data) => setMachineStatuses(data))
        .catch((error) => console.error('Error fetching machine statuses:', error));
    }, 1000); // Moved interval setup inside useEffect and added a delay

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return 'blue';        // Idle
      case 1:
        return 'orange';      // Initializing
      case 2:
        return 'yellow';      // Ready
      case 3:
        return 'lightgreen';       // Running
      case 4:
        return 'red';         // Error
      default:
        return 'gray';        // Default color
    }
  };

  const calculateRelativePosition = (x, y) => {
    if (!imageRef.current) return { left: 0, top: 0 }; // If imageRef is not available yet, return default position
    const imageRect = imageRef.current.getBoundingClientRect(); // Get the bounding rectangle of the image
    const relativeLeft = (x / imageRect.width) * 90; // Calculate relative left position
    const relativeTop = (y / imageRect.height) * 90; // Calculate relative top position
    return { left: relativeLeft + '%', top: relativeTop + '%' }; // Return position as percentage
  };

  return (
    <div style={{ width: "100%", marginBottom: "20px", position: 'relative', display: 'inline-block' }}>
      <img
        ref={imageRef} // Attach the ref to the image
        src={pflImage}
        alt="Production Floor Layout"
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
      />
      {machineStatuses.map((machine, index) => (
        <div
         key={machine.id}
          style={{
            position: 'absolute',
            ...calculateRelativePosition(150, 70), // Calculate relative position
            backgroundColor: getStatusColor(machine.machine_status),
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
            fontSize: '12px',
            textAlign: 'center',
          }}
        >
          <span style={{ color: 'black', fontSize: '12px', textAlign: 'center', display: 'block' }}>
            {index + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ImageWithLabels;
