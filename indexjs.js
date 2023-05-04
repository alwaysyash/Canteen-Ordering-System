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

    let canteen_filter = [];
    all_orders.forEach((odr) => {
      if (odr.canteen_id === valuePassed) canteen_filter.push(odr);
    });
    // console.log(canteen_filter)

    // Dynamic card code
    const upcomingContainer = document.getElementById("upcoming");
    const progressContainer = document.getElementById("progress");
    const readyContainer = document.getElementById("ready");
    let number = 1;
    canteen_filter.forEach((order) => {
      // console.log(order.status)

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
      orderNumberHeading.textContent = `Order Number: ${order.token_number}`;
      
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

      // ordersContainer.appendChild(card);
      if (order.status == "Placed") {
        const markInProgressButton = document.createElement("button");
        markInProgressButton.classList.add("btn1", "mt-1", "mb-1");
        markInProgressButton.textContent = "Mark In-progress";
        markInProgressButton.addEventListener("click", () => {
          const orderId = order.id;
          const odrRef = doc(db, "orders", orderId);
          updateDoc(odrRef, {
            status: "In Progress",
          })
            .then(() => {
              console.log("Order status updated successfully!");
              location.reload();
            })
            .catch((error) => {
              console.error("Error updating order status:", error);
            });
        });
        cardFooter.appendChild(markInProgressButton);
        card.appendChild(cardFooter);
        upcomingContainer.appendChild(card);
      }

      if (order.status == "In Progress") {
        const markReadyButton = document.createElement("button");
        markReadyButton.classList.add("btn1", "mt-1", "mb-1");
        markReadyButton.textContent = "Mark Ready";
        markReadyButton.addEventListener("click", () => {
          const orderId = order.id;
          const odrRef = doc(db, "orders", orderId);
          updateDoc(odrRef, {
            status: "Ready",
          })
            .then(() => {
              console.log("Order status updated successfully!");
              location.reload();
            })
            .catch((error) => {
              console.error("Error updating order status:", error);
            });
        });
        cardFooter.appendChild(markReadyButton);
        card.appendChild(cardFooter);

        progressContainer.appendChild(card);
      }
      if (order.status == "Ready") {
        const deliveredButton = document.createElement("button");
        deliveredButton.classList.add("btn1", "mt-1", "mb-1", "mx-3");
        deliveredButton.textContent = "Delivered";
        deliveredButton.addEventListener("click", () => {
          const orderId = order.id;
          const odrRef = doc(db, "orders", orderId);
          updateDoc(odrRef, {
            status: "Completed",
          })
            .then(() => {
              console.log("Order status updated successfully!");
              location.reload();
            })
            .catch((error) => {
              console.error("Error updating order status:", error);
            });
        });
        cardFooter.appendChild(deliveredButton);

        const cancelButton = document.createElement("button");
        cancelButton.classList.add("btn2", "mt-1", "mb-1", "mx-3");
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener("click", () => {
          const orderId = order.id;
          const odrRef = doc(db, "orders", orderId);
          updateDoc(odrRef, {
            status: "Cancelled",
          })
            .then(() => {
              console.log("Order status updated successfully!");
              location.reload();
            })
            .catch((error) => {
              console.error("Error updating order status:", error);
            });
        });
        cardFooter.appendChild(cancelButton);

        card.appendChild(cardFooter);

        readyContainer.appendChild(card);
      }
    });
    document
      .getElementById("ordernav")
      .addEventListener("click", redirectToOrders, false);
    function redirectToOrders() {
      window.location.href =
        "/orders.html?value=" + encodeURIComponent(valuePassed);
      return false;
    }

    document
      .getElementById("lognav")
      .addEventListener("click", redirectToLogin, false);
    function redirectToLogin() {
      window.location.href = "/login.html";
      return false;
    }
  })

  .catch((err) => {
    console.log(err.message);
  });
