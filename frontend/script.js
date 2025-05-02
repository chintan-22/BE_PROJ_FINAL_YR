// // Firebase and form submission combined script
// document.addEventListener("DOMContentLoaded", async function () {
//     const form = document.getElementById("soilForm");
//     const displayArea = document.getElementById("displayData");
//     const viewDataBtn = document.getElementById("viewDataBtn");
//     const statusElement = document.getElementById('firebaseStatus');
//     let backendPort = 5002;

//     // Initialize Firebase
//     const firebaseConfig = {
//         apiKey: "AIzaSyD3E2UgTKUJ4pAimCXj-ubBbwW2ZG192GM",
//         authDomain: "precisionfarming-216d3.firebaseapp.com",
//         databaseURL: "https://precisionfarming-216d3-default-rtdb.firebaseio.com",
//         projectId: "precisionfarming-216d3",
//         storageBucket: "precisionfarming-216d3.firebasestorage.app",
//         messagingSenderId: "408446526312",
//         appId: "1:408446526312:web:f92e9441c62cf5203bacdd",
//         measurementId: "G-KQ65K4XYCW"
//       };
    
//     firebase.initializeApp(firebaseConfig);
//     const database = firebase.database();
//     console.log("Firebase initialized");

//     // Setup Firebase auto-refresh
//     setupAutoRefresh();

//     // Try to get the backend port, but use default if not available
//     await getBackendPort();

//     // Set up form submission handler
//     form.addEventListener("submit", handleFormSubmit);
    
//     // Set up view data button handler
//     viewDataBtn.addEventListener("click", function() {
//         // Open in a new tab instead of navigating away
//         window.open(`http://localhost:${backendPort}/api/sensors/data`, '_blank');
//     });

//     // Try to fetch latest prediction when page loads
//     await fetchLatestPrediction();

//     // FUNCTION DEFINITIONS

//     // Function to fetch latest sensor data from Firebase
//     function fetchLatestSensorData() {
//         statusElement.textContent = "Fetching latest sensor data...";
        
//         // Reference to your sensor data in Firebase
//         const dataRef = database.ref('sensor_data');
        
//         // Get all entries to find the latest
//         dataRef.orderByKey().limitToLast(1).once('value')
//             .then((snapshot) => {
//                 if (snapshot.exists()) {
//                     let latestData = null;
//                     let latestTimestamp = null;
                    
//                     // Extract the latest data
//                     snapshot.forEach((childSnapshot) => {
//                         latestTimestamp = childSnapshot.key;
//                         latestData = childSnapshot.val();
//                         console.log("Latest timestamp:", latestTimestamp);
//                         console.log("Latest data:", latestData);
//                     });
                    
//                     if (latestData) {
//                         // Fill in the temperature, humidity, rainfall and ph fields
//                         document.getElementById('temperature').value = latestData.temperature || '';
//                         document.getElementById('humidity').value = latestData.humidity || '';
//                         document.getElementById('rainfall').value = latestData.rainfall || '';
//                         document.getElementById('ph').value = latestData.ph || '';
                        
//                         // Show success message
//                         statusElement.textContent = `Sensor data loaded successfully! (Last updated: ${latestData.timestamp})`;
//                         statusElement.style.color = 'green';
//                     } else {
//                         statusElement.textContent = "No sensor data found in the database.";
//                         statusElement.style.color = 'orange';
//                     }
//                 } else {
//                     statusElement.textContent = "No sensor data found in the database.";
//                     statusElement.style.color = 'orange';
//                 }
//             })
//             .catch((error) => {
//                 console.error("Firebase error:", error);
//                 statusElement.textContent = `Error loading sensor data: ${error.message}`;
//                 statusElement.style.color = 'red';
//             });
//     }
    

//     // Function to set up auto-refresh of sensor data
//     function setupAutoRefresh() {
//         // Initial fetch when page loads
//         fetchLatestSensorData();
        
//         // Set an interval to fetch data every minute (60000 milliseconds)
//         setInterval(function() {
//             console.log("Auto-refreshing sensor data...");
//             fetchLatestSensorData();
//         }, 60000);
//     }

//     // Function to get the backend port
//     async function getBackendPort() {
//         try {
//             const response = await fetch("/api/config");
//             if (response.ok) {
//                 const config = await response.json();
//                 backendPort = config.port;
//                 console.log("Using backend port:", backendPort);
//             }
//         } catch (error) {
//             console.log("Using default port:", backendPort);
//         }
//     }

//     // Function to handle form submission
//     async function handleFormSubmit(event) {
//         event.preventDefault();
//         displayArea.innerHTML = "<p>Processing data...</p>";

//         const soilData = {
//             nitrogen: document.getElementById("nitrogen").value,
//             phosphorus: document.getElementById("phosphorus").value,
//             potassium: document.getElementById("potassium").value,
//             temperature: document.getElementById("temperature").value,
//             humidity: document.getElementById("humidity").value,
//             ph: document.getElementById("ph").value,
//             rainfall: document.getElementById("rainfall").value
//         };

//         try {
//             // Send data and get prediction directly
//             const response = await fetch(`http://localhost:${backendPort}/api/sensors/data`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(soilData),
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to submit data");
//             }

//             const result = await response.json();
//             console.log("Response from server:", result);
            
//             if (result.prediction && result.prediction.recommended_crop) {
//                 displayPrediction(result.prediction.recommended_crop);
//             } else {
//                 throw new Error("No prediction received");
//             }

//             // Clear the form after successful submission
//             // form.reset();
//         } catch (error) {
//             console.error("Error:", error);
//             displayArea.innerHTML = `<p class="error">Error: ${error.message}</p>`;
//         }
//     }

//     // Function to display prediction results
//     function displayPrediction(crop) {
//         console.log("Displaying crop:", crop); 
//         displayArea.innerHTML = `
//             <h3>Results</h3>
//             <div class="prediction-result">
//                 <p><strong>Recommended Crop:</strong> ${crop}</p>
//             </div>
//         `;
//     }

//     // Function to fetch latest prediction
//     async function fetchLatestPrediction() {
//         try {
//             const response = await fetch(`http://localhost:${backendPort}/api/sensors/latest`);
//             if (response.ok) {
//                 const latestData = await response.json();
//                 if (latestData.prediction) {
//                     displayPrediction(latestData.prediction);
//                 }
//             }
//         } catch (error) {
//             console.log("No previous data found");
//         }
//     }
// });

// Firebase and form submission combined script
document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("soilForm");
    const displayArea = document.getElementById("displayData");
    const viewDataBtn = document.getElementById("viewDataBtn");
    const statusElement = document.getElementById('firebaseStatus');
    let backendPort = 5003;

    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyD3E2UgTKUJ4pAimCXj-ubBbwW2ZG192GM",
        authDomain: "precisionfarming-216d3.firebaseapp.com",
        databaseURL: "https://precisionfarming-216d3-default-rtdb.firebaseio.com",
        projectId: "precisionfarming-216d3",
        storageBucket: "precisionfarming-216d3.firebasestorage.app",
        messagingSenderId: "408446526312",
        appId: "1:408446526312:web:f92e9441c62cf5203bacdd",
        measurementId: "G-KQ65K4XYCW"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    console.log("Firebase initialized");

    // Setup Firebase auto-refresh
    setupAutoRefresh();

    // Try to get the backend port, but use default if not available
    await getBackendPort();


    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyy");
    // Set up form submission handler
    form.addEventListener("submit", handleFormSubmit);

    // Set up view data button handler
    viewDataBtn.addEventListener("click", function () {
        // Open in a new tab instead of navigating away
        window.open(`http://localhost:${backendPort}/api/sensors/data`, '_blank');
    });

    // Try to fetch latest prediction when page loads
    await fetchLatestPrediction();

    // FUNCTION DEFINITIONS
    // Function to fetch latest sensor data from Firebase
    function fetchLatestSensorData() {
        statusElement.textContent = "Fetching latest sensor data...";
        // Reference to your sensor data in Firebase
        const dataRef = database.ref('sensor_data');
        // Get all entries to find the latest
        dataRef.orderByKey().limitToLast(1).once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let latestData = null;
                    let latestTimestamp = null;
                    // Extract the latest data
                    snapshot.forEach((childSnapshot) => {
                        latestTimestamp = childSnapshot.key;
                        latestData = childSnapshot.val();
                        console.log("Latest timestamp:", latestTimestamp);
                        console.log("Latest data:", latestData);
                    });
                    if (latestData) {
                        // Fill input fields with the fetched data
                        document.getElementById('temperature').value = latestData.temperature_C || '';
                        document.getElementById('humidity').value = latestData.humidity_percent || '';
                        document.getElementById('rainfall').value = latestData.rainfall_mm || '';
                        document.getElementById('ph').value = latestData.pH || '';

                        // Show success message
                        statusElement.textContent = `Sensor data loaded successfully! (Last updated: ${latestData.timestamp})`;
                        statusElement.style.color = 'green';

                        // Clear the displayArea content
                        displayArea.innerHTML = '';

                    } else {
                        statusElement.textContent = "No sensor data found in the database.";
                        statusElement.style.color = 'orange';
                    }
                } else {
                    statusElement.textContent = "No sensor data found in the database.";
                    statusElement.style.color = 'orange';
                }
            })
            .catch((error) => {
                console.error("Firebase error:", error);
                statusElement.textContent = `Error loading sensor data: ${error.message}`;
                statusElement.style.color = 'red';
            });
    }


    // Function to set up auto-refresh of sensor data
    function setupAutoRefresh() {
        // Initial fetch when page loads
        fetchLatestSensorData();
        // Set an interval to fetch data every minute (60000 milliseconds)
        setInterval(function () {
            console.log("Auto-refreshing sensor data...");
            fetchLatestSensorData();
        }, 60000);
    }

    // Function to get the backend port
    async function getBackendPort() {
        try {
            const response = await fetch("/api/config");
            if (response.ok) {
                const config = await response.json();
                backendPort = config.port;
                console.log("Using backend port:", backendPort);
            }
        } catch (error) {
            console.log("Using default port:", backendPort);
        }
    }

    // Function to handle form submission
    // Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    console.log("Form submitted");
    displayArea.innerHTML = "<p>Processing data...</p>";
    
    const soilData = {
        nitrogen: document.getElementById("nitrogen").value,
        phosphorus: document.getElementById("phosphorus").value,
        potassium: document.getElementById("potassium").value,
        temperature: document.getElementById("temperature").value,
        humidity: document.getElementById("humidity").value,
        ph: document.getElementById("ph").value,
        rainfall: document.getElementById("rainfall").value
    };
    
    try {
        // Send data and get prediction directly
        const response = await fetch(`http://localhost:5003/api/sensors/data`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(soilData),
        });
        
        if (!response.ok) {
            throw new Error("Failed to submit data");
        }
        
        const result = await response.json();
        console.log("Response from server:", result);
        
        // Check the actual structure of the prediction
        if (result.data.prediction) {
            // The prediction is directly available as a string
            displayPrediction(result.data.prediction);
        } else {
            throw new Error("No prediction received");
        }
    } catch (error) {
        console.error("Error:", error);
        displayArea.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Function to display prediction results
function displayPrediction(crop) {
    console.log("Displaying crop:", crop);
    displayArea.innerHTML = `
        <h3>Results</h3>
        <div class="prediction-result">
            <p><strong>Recommended Crop:</strong> ${crop}</p>
        </div>
    `;
}

    // Function to display prediction results
   

    // Function to fetch latest prediction
   // Function to fetch latest prediction
async function fetchLatestPrediction() {
    try {
        const response = await fetch(`http://localhost:${backendPort}/api/sensors/latest`);
        if (response.ok) {
            const latestData = await response.json();
            console.log("Latest data:", latestData);
            
            if (latestData.prediction) {
               const crop = displayPrediction(latestData.prediction);
               console.log("oooooooooooooooooooooooooooooooooooo", crop);
            }
        }
    } catch (error) {
        console.log("No previous data found:", error);
    }
}
});

