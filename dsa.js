// login
let users = [
  { username: "user1", password: "pass1" },
  { username: "user2", password: "pass2" }
];

// bus category
let buses = {
  luxury: [
    { busName: "Luxury-21", price: 700, availableSeats: 30 },
    { busName: "Luxury-22", price: 700, availableSeats: 30 },
    { busName: "Luxury-23", price: 700, availableSeats: 30 },
    { busName: "Luxury-24", price: 700, availableSeats: 30 }
    ],
  aircon: [
    { busName: "Aircon-31", price: 400, availableSeats: 30 },
    { busName: "Aircon-32", price: 400, availableSeats: 30 },
    { busName: "Aircon-33", price: 400, availableSeats: 30 },
    { busName: "Aircon-34", price: 400, availableSeats: 30 }
    ],
  minibus: [
    { busName: "Mini-41", price: 300, availableSeats: 25 },
    { busName: "Mini-42", price: 300, availableSeats: 25 },
    { busName: "Mini-43", price: 300, availableSeats: 25 },
    { busName: "Mini-44", price: 300, availableSeats: 25 }
    ],
  uvx: [
    { busName: "UVX-51", price: 150, availableSeats: 20 },
    { busName: "UVX-52", price: 150, availableSeats: 20 },
    { busName: "UVX-53", price: 150, availableSeats: 20 },
    { busName: "UVX-54", price: 150, availableSeats: 20 }
    ]
};

// reservations
let reservations = [];

// login
function login() {
  let username = prompt("Enter username:");
  let password = prompt("Enter password:");
  for (let user of users) {
    if (user.username === username && user.password === password) {
      alert("Login successful!");
      return username;
    }
  }
  alert("Invalid credentials.");
  return null;
}

// choose category
function chooseCategory() {
  // ask user to choose a category and convert it to lowercase
  let category = prompt("Choose category (luxury, aircon, minibus, uvx):").toLowerCase();

  // if the chosen category is not in the buses list, show an error
  if (!buses[category]) {
    alert("Invalid category.");
    return null;
  }

  // create a list of available buses in the chosen category
  let list = "Available buses:\n";
  buses[category].forEach((bus, i) => {
    list += `${i + 1}. ${bus.busName} - ₱${bus.price} - Seats: ${bus.availableSeats}\n`;
  });

  // show the list to the user
  alert(list);

  // ask the user to choose a bus by number
  let busIndex = parseInt(prompt("Choose a bus number:")) - 1;

  // check if the bus number is valid
  if (busIndex < 0 || busIndex >= buses[category].length) {
    alert("Invalid bus selection.");
    return null;
  }

  // return the chosen category and bus index
  return { category, busIndex };
}

// reserve a seat
function reserveSeat(name, category, busIndex) {
  // ask user to enter the seat number they want
  let seatNumber = prompt("Enter seat number to reserve:");

  // get the selected bus from the list
  let bus = buses[category][busIndex];

  // check if this seat is already reserved by the same person
  for (let r of reservations) {
    if (r.passenger === name && r.busName === bus.busName && r.seatNumber === seatNumber) {
      alert("Seat already reserved by you.");
      return;
    }
  }

  // if no seats left, show an alert
  if (bus.availableSeats <= 0) {
    alert("No seats left.");
    return;
  }

  // add the reservation to the list
  reservations.push({
    passenger: name,
    category,
    busName: bus.busName,
    seatNumber,
    price: bus.price,
    paid: false,
    paymentPhoto: null
  });

  // decrease the number of available seats
  bus.availableSeats--;

  // show success message
  alert("Seat reserved successfully!");
}

// cancel reservation
function cancelSeat(name) {
  // ask for bus name and seat number to cancel
  let busName = prompt("Enter bus name to cancel:");
  let seatNumber = prompt("Enter seat number to cancel:");

  // look for the matching reservation
  for (let i = 0; i < reservations.length; i++) {
    let r = reservations[i];
    if (r.passenger === name && r.busName === busName && r.seatNumber === seatNumber) {
      // remove the reservation
      reservations.splice(i, 1);

      // find the bus and increase its available seats
      for (let cat in buses) {
        for (let j = 0; j < buses[cat].length; j++) {
          if (buses[cat][j].busName === busName) {
            buses[cat][j].availableSeats++;
            alert("Reservation canceled.");
            return;
          }
        }
      }
    }
  }

  // if no matching reservation is found
  alert("Reservation not found.");
}

// make payment
function makePayment(name) {
  // ask user for bus name, seat number, and photo as proof of payment
  let busName = prompt("Enter bus name for payment:");
  let seatNumber = prompt("Enter seat number for payment:");
  let photo = prompt("Enter payment photo filename or URL:");

  // find the matching reservation
  for (let r of reservations) {
    if (r.passenger === name && r.busName === busName && r.seatNumber === seatNumber) {
      // mark as paid and save the payment photo
      r.paid = true;
      r.paymentPhoto = photo;
      alert("Payment completed.");
      return;
    }
  }

  // if reservation is not found
  alert("Reservation not found.");
}

// view reservations
function printReservations() {
  if (reservations.length === 0) {
    alert("No reservations yet.");
    return;
  }

  let result = "";
  reservations.forEach(r => {
    result += `Passenger: ${r.passenger}\nBus: ${r.busName} (${r.category})\nSeat: ${r.seatNumber}\nPrice: ₱${r.price}\nPaid: ${r.paid ? "Yes" : "No"}\nPhoto: ${r.paymentPhoto || "None"}\n-----\n`;
  });

  alert(result);
}

// menu where the options r made
function main() {
  let user = login();
  if (!user) return;

  while (true) {
    let choice = prompt(
      "Choose an option:\n1. Reserve Seat\n2. Cancel Seat\n3. Make Payment\n4. View Reservations\n5. Exit"
    );

    if (choice === "1") {
      let info = chooseCategory();
      if (info) reserveSeat(user, info.category, info.busIndex);
    } else if (choice === "2") {
      cancelSeat(user);
    } else if (choice === "3") {
      makePayment(user);
    } else if (choice === "4") {
      printReservations();
    } else if (choice === "5") {
      alert("Goodbye!");
      break;
    } else {
      alert("Invalid option.");
    }
  }
}

main();