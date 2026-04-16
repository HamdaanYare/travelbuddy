// Sample Destinations Data
const destinations = [
    { name: "Paris, France", price: "$599", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400", rating: "4.8", days: "7 Days" },
    { name: "Tokyo, Japan", price: "$799", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", rating: "4.9", days: "10 Days" },
    { name: "New York, USA", price: "$449", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400", rating: "4.7", days: "5 Days" },
    { name: "Dubai, UAE", price: "$699", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", rating: "4.9", days: "6 Days" },
    { name: "Bali, Indonesia", price: "$529", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400", rating: "4.8", days: "8 Days" },
    { name: "London, UK", price: "$649", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", rating: "4.6", days: "7 Days" }
];

// Sample Flights Data
const flights = [
    { id: 1, airline: "Emirates", from: "New York", to: "Dubai", price: 899, duration: "12h 30m", departure: "08:00 AM" },
    { id: 2, airline: "Qatar Airways", from: "London", to: "Tokyo", price: 749, duration: "11h 45m", departure: "10:30 PM" },
    { id: 3, airline: "Singapore Airlines", from: "Los Angeles", to: "Singapore", price: 999, duration: "17h 20m", departure: "11:15 PM" },
    { id: 4, airline: "Turkish Airlines", from: "Chicago", to: "Istanbul", price: 649, duration: "10h 15m", departure: "07:45 PM" }
];

// Sample Hotels Data
const hotels = [
    { id: 1, name: "Grand Plaza Hotel", location: "Downtown", price: 199, rating: 4.5, amenities: "Pool, Spa, WiFi" },
    { id: 2, name: "Seaside Resort", location: "Beachfront", price: 299, rating: 4.8, amenities: "Beach Access, Pool, Restaurant" },
    { id: 3, name: "City Central Inn", location: "City Center", price: 149, rating: 4.3, amenities: "Gym, WiFi, Breakfast" }
];

// Current User
let currentUser = null;
let bookings = [];

// Load Destinations
function loadDestinations() {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;
    
    grid.innerHTML = destinations.map(dest => `
        <div class="destination-card" onclick="bookDestination('${dest.name}', '${dest.price}')">
            <img src="${dest.image}" alt="${dest.name}">
            <div class="destination-info">
                <h3>${dest.name}</h3>
                <p><i class="fas fa-star" style="color: #ffd700;"></i> ${dest.rating} | ${dest.days}</p>
                <p class="price">Starting from ${dest.price}</p>
                <button class="book-now">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Search Flights
document.getElementById('searchFlightsBtn')?.addEventListener('click', () => {
    const from = document.getElementById('fromCity')?.value;
    const to = document.getElementById('toCity')?.value;
    
    if (!from || !to) {
        alert('Please enter departure and destination cities');
        return;
    }
    
    const filteredFlights = flights.filter(f => 
        f.from.toLowerCase().includes(from.toLowerCase()) || 
        f.to.toLowerCase().includes(to.toLowerCase())
    );
    
    displayFlights(filteredFlights);
});

function displayFlights(flightsToShow) {
    const resultsSection = document.getElementById('flightsResults');
    const flightsList = document.getElementById('flightsList');
    
    if (!resultsSection || !flightsList) return;
    
    if (flightsToShow.length === 0) {
        flightsList.innerHTML = '<p>No flights found. Try different destinations.</p>';
    } else {
        flightsList.innerHTML = flightsToShow.map(flight => `
            <div class="result-card">
                <h3><i class="fas fa-plane"></i> ${flight.airline}</h3>
                <p>${flight.from} → ${flight.to}</p>
                <p>Departure: ${flight.departure} | Duration: ${flight.duration}</p>
                <div class="price">$${flight.price}</div>
                <button class="book-now" onclick="bookFlight(${flight.id})">Book Now</button>
            </div>
        `).join('');
    }
    
    resultsSection.style.display = 'block';
    document.getElementById('hotelsResults').style.display = 'none';
}

// Search Hotels
document.getElementById('searchHotelsBtn')?.addEventListener('click', () => {
    const destination = document.getElementById('hotelDestination')?.value;
    
    if (!destination) {
        alert('Please enter a destination');
        return;
    }
    
    displayHotels(hotels);
});

function displayHotels(hotelsToShow) {
    const resultsSection = document.getElementById('hotelsResults');
    const hotelsList = document.getElementById('hotelsList');
    
    if (!resultsSection || !hotelsList) return;
    
    hotelsList.innerHTML = hotelsToShow.map(hotel => `
        <div class="result-card">
            <h3><i class="fas fa-hotel"></i> ${hotel.name}</h3>
            <p>📍 ${hotel.location}</p>
            <p>⭐ ${hotel.rating} | ${hotel.amenities}</p>
            <div class="price">$${hotel.price}/night</div>
            <button class="book-now" onclick="bookHotel(${hotel.id})">Book Now</button>
        </div>
    `).join('');
    
    resultsSection.style.display = 'block';
    document.getElementById('flightsResults').style.display = 'none';
}

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.form-group').forEach(form => form.classList.remove('active'));
        
        if (tab === 'flights') {
            document.getElementById('flightsForm').classList.add('active');
        } else {
            document.getElementById('hotelsForm').classList.add('active');
        }
    });
});

// Booking Functions
function bookFlight(flightId) {
    if (!currentUser) {
        alert('Please login to book flights');
        document.getElementById('authModal').style.display = 'flex';
        return;
    }
    
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return;
    
    showBookingModal(`Flight: ${flight.airline} from ${flight.from} to ${flight.to}`, flight.price);
}

function bookHotel(hotelId) {
    if (!currentUser) {
        alert('Please login to book hotels');
        document.getElementById('authModal').style.display = 'flex';
        return;
    }
    
    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) return;
    
    showBookingModal(`Hotel: ${hotel.name} in ${hotel.location}`, hotel.price);
}

function bookDestination(name, price) {
    if (!currentUser) {
        alert('Please login to book packages');
        document.getElementById('authModal').style.display = 'flex';
        return;
    }
    
    const priceNum = parseInt(price.replace('$', ''));
    showBookingModal(`Package: ${name}`, priceNum);
}

function showBookingModal(details, price) {
    const modal = document.getElementById('bookingModal');
    const bookingDetails = document.getElementById('bookingDetails');
    const totalPrice = document.getElementById('totalPrice');
    
    bookingDetails.innerHTML = `<p>${details}</p><p>Includes taxes & fees</p>`;
    totalPrice.innerText = price;
    modal.style.display = 'flex';
}

// Confirm Booking
document.getElementById('confirmBooking')?.addEventListener('click', () => {
    const total = document.getElementById('totalPrice').innerText;
    bookings.push({ id: Date.now(), total, date: new Date() });
    alert(`Booking confirmed! Total: $${total}\nThank you for choosing TravelBuddy!`);
    document.getElementById('bookingModal').style.display = 'none';
});

// Auth Functions
document.getElementById('loginBtn')?.addEventListener('click', () => {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
});

document.getElementById('signupBtn')?.addEventListener('click', () => {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
});

document.getElementById('doLogin')?.addEventListener('click', () => {
    const email = document.getElementById('loginEmail')?.value;
    if (email) {
        currentUser = email;
        alert(`Welcome back, ${email}!`);
        document.getElementById('authModal').style.display = 'none';
        updateAuthUI();
    } else {
        alert('Please enter email');
    }
});

document.getElementById('doSignup')?.addEventListener('click', () => {
    const name = document.getElementById('signupName')?.value;
    const email = document.getElementById('signupEmail')?.value;
    
    if (name && email) {
        currentUser = email;
        alert(`Welcome to TravelBuddy, ${name}!`);
        document.getElementById('authModal').style.display = 'none';
        updateAuthUI();
    } else {
        alert('Please fill all fields');
    }
});

document.getElementById('showSignup')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
});

document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
});

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (currentUser) {
        if (loginBtn) loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.split('@')[0]}`;
        if (signupBtn) signupBtn.style.display = 'none';
    }
}

// Close Modals
document.querySelectorAll('.close').forEach(close => {
    close.addEventListener('click', () => {
        document.getElementById('bookingModal').style.display = 'none';
        document.getElementById('authModal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Set today's date as min for date inputs
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = today;
    if (!input.value) input.value = today;
});

// Initialize
loadDestinations();

// Mobile Menu Toggle
document.querySelector('.mobile-menu')?.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    const navAuth = document.querySelector('.nav-auth');
    if (navLinks) navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if (navAuth) navAuth.style.display = navAuth.style.display === 'flex' ? 'none' : 'flex';
});

console.log('TravelBuddy - Built by Mohamed Abdiwahab Hussein © 2025');