document.addEventListener("DOMContentLoaded", () => {
    const ipElement = document.getElementById("ip");
    const cityElement = document.getElementById("city");
    const regionElement = document.getElementById("region");
    const latitudeElement = document.getElementById("latitude");
    const longitudeElement = document.getElementById("longitude");
    const organizationElement = document.getElementById("organization");
    const timezoneElement = document.getElementById("timezone");
    const dateElement = document.getElementById("date");
    const pincodeElement = document.getElementById("pincode");
    const messageElement = document.getElementById("message");
    const postOfficeCards = document.getElementById("post-office-cards");

   
    fetch("https://ipapi.co/json/")
        .then(response => response.json())
        .then(data => {
           
            ipElement.textContent = data.ip || "N/A";
            cityElement.textContent = data.city || "N/A";
            regionElement.textContent = data.region || "N/A";
            latitudeElement.textContent = data.latitude || "N/A";
            longitudeElement.textContent = data.longitude || "N/A";
            organizationElement.textContent = data.org || "N/A";
            timezoneElement.textContent = data.timezone || "N/A";
            dateElement.textContent = new Date().toLocaleString("en-US", { timeZone: data.timezone });
            pincodeElement.textContent = data.postal || "N/A";

           
            const map = L.map("map").setView([data.latitude, data.longitude], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
            }).addTo(map);
            L.marker([data.latitude, data.longitude]).addTo(map)
                .bindPopup("You are here!")
                .openPopup();

            
            const pincode = data.postal || "";
            if (pincode) {
                fetch(`https://api.postalpincode.in/pincode/${pincode}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Failed to fetch post offices");
                        }
                        return response.json();
                    })
                    .then(postOfficeData => {
                        const postOffices = postOfficeData[0]?.PostOffice || [];
                        messageElement.textContent = `Found ${postOffices.length} post offices in your area.`;

                        if (postOffices.length > 0) {
                            postOfficeCards.innerHTML = postOffices.map(postOffice => `
                                <div class="post-office-card">
                                    <h3>${postOffice.Name}</h3>
                                    <p>Branch Type: ${postOffice.BranchType}</p>
                                    <p>Delivery Status: ${postOffice.DeliveryStatus}</p>
                                    <p>District: ${postOffice.District}</p>
                                    <p>Division: ${postOffice.Division}</p>
                                </div>
                            `).join("");
                        } else {
                            postOfficeCards.innerHTML = "<p>No post offices found for this pincode.</p>";
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching post offices:", error);
                        messageElement.textContent = "Unable to fetch post offices.";
                    });
            } else {
                messageElement.textContent = "Pincode not available.";
            }
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
        });
});
