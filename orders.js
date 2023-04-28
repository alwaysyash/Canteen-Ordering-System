import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-analytics.js";

// Add Firebase products that you want to use
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyD5TKCHJrdQan6mrfk4NmuaLYhzFx_G5AI",
  authDomain: "vihwafoodie.firebaseapp.com",
  projectId: "vihwafoodie",
  storageBucket: "vihwafoodie.appspot.com",
  messagingSenderId: "811791488279",
  appId: "1:811791488279:web:248ed320159d0debd49352",
  measurementId: "G-LMSRJT4128",
};

initializeApp(firebaseConfig);

const db = getFirestore(); //database connection

const collRef = collection(db, "orders"); //reference
let orders = [];
let ids = [];
//get data
getDocs(collRef)
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      orders.push(doc.data());
      ids.push(doc.id);
    });
    //   console.log(ids)
    let all_orders = [];
    let i = 0;
    orders.forEach((odr) => {
      // console.log(odr);
      odr.id = ids[i];
      i++;
      all_orders.push(odr);
    });
    //   console.log(all_orders);

    //Filter by canteen name
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var valuePassed = urlParams.get("value");

    let order_filter = [];
    all_orders.forEach((odr) => {
      if (odr.canteen_id === valuePassed && (odr.status==="delivered" || odr.status==="cancelled")) 
      {order_filter.push(odr);}


    });
    console.log(order_filter)

    // Dynamic card code
    const cardsContainer = document.getElementById("row");
    
    let number = 1;
    order_filter.forEach((order) => {
      console.log(order.status)

      // Create card element
      const card = document.createElement("div");
      card.classList.add("card", "border-success", "mb-3");
      card.style.minWidth = "80%";
      card.style.maxWidth = "80%";
      card.style.borderRadius = "10px";

      // Create card header
      const cardHeader = document.createElement("div");
      cardHeader.classList.add(
        "card-header",
        "bg-transparent",
        "border-dark",
        "my-1"
      );

      const orderNumberHeading = document.createElement("h5");
      orderNumberHeading.style.fontWeight = "bold";
      // orderNumberHeading.textContent = `Order Number: ${order.canteen_id}`;
      orderNumberHeading.textContent = `Order Number: ${number} (${order.status})`;
      number++;
      cardHeader.appendChild(orderNumberHeading);
      card.appendChild(cardHeader);

      // Create card body
      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body", "text-center");
      const table = document.createElement("table");
      table.classList.add("table", "table-bordered", "table-hover");
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      const headerColumns = ["Item #", "Name", "Quantity"];
      headerColumns.forEach((columnTitle) => {
        const column = document.createElement("th");
        column.textContent = columnTitle;
        headerRow.appendChild(column);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      order.food_items.forEach((item, index) => {
        // console.log(item);
        const row = document.createElement("tr");
        const itemNumber = document.createElement("th");
        itemNumber.setAttribute("scope", "row");
        itemNumber.textContent = index + 1;
        const itemName = document.createElement("td");
        itemName.textContent = item.menu_item.name;
        const itemQuantity = document.createElement("td");
        itemQuantity.textContent = item.quantity;
        row.appendChild(itemNumber);
        row.appendChild(itemName);
        row.appendChild(itemQuantity);
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      cardBody.appendChild(table);
      card.appendChild(cardBody);

      // Create card footer
      const cardFooter = document.createElement("div");
      cardFooter.classList.add(
        "card-footer",
        "bg-transparent",
        "border-dark",
        "d-flex",
        "justify-content-center"
      );
       
      const orderID = document.createElement("h6");
      orderID.textContent = `Order Number: ${order.id}`;
      cardFooter.appendChild(orderID);
      card.appendChild(cardFooter);
      cardsContainer.appendChild(card);
      

    });
  })

  .catch((err) => {
    console.log(err.message);
  });