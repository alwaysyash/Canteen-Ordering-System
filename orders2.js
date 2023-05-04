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
const cardsContainer = document.getElementById("row");
const d1 = document.createElement("div");
cardsContainer.classList.add("col-auto");
d1.classList.add("row", "justify-content-center");
const table = document.createElement("table");
const thead = document.createElement("thead");
      const headrow = document.createElement("tr");
      const headercols = ['Token Number','Order ID', 'Order Time','Order Status', 'Items', 'Total Price']
      headercols.forEach((col)=>{
        const column = document.createElement("th");
        column.textContent = col;
        headrow.appendChild(column);
        // headrow.appendChild(col);
      })
headrow.classList.add('table-dark')
// thead.classList.add("table","thead-dark");
thead.appendChild(headrow);
table.appendChild(thead);
table.classList.add("table", "table-bordered", "table-hover", "center");
const tbody = document.createElement('tbody');

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
      if (
        odr.canteen_id === valuePassed &&
        (odr.status === "Completed" || odr.status === "Cancelled")
      ) {
        order_filter.push(odr);
      }
    });
    console.log(order_filter);

 
  
    let number = 1;
    order_filter.forEach((order) => {
      console.log(order.status);
      //Create table
      const tr = document.createElement('tr');
      const tokenNo = document.createElement('td');
      const orderID = document.createElement('td');
      const orderTime=document.createElement('td');
      const orderStatus = document.createElement('td');
      const orderItems = document.createElement('td');
      const total = document.createElement('td');

      tokenNo.textContent=order.token_number;
      orderID.textContent = order.id;
      orderStatus.textContent = order.status;
      orderTime.textContent=order.creation_time.toDate();
      let items = [];
      var price = 0;
      order.food_items.forEach((item) => {
        items.push(item.menu_item.name+' x '+item.quantity+' ('+item.menu_item.price+'Rs'+')');
        price += item.menu_item.price;
      })
      orderItems.textContent = items.join(', ');
      total.textContent = price;
      tr.appendChild(tokenNo);
      tr.appendChild(orderID);
      tr.appendChild(orderTime);
      console.log('appended 1');
      tr.appendChild(orderStatus);
      console.log('appended 2');
      tr.appendChild(orderItems);
      console.log('appended 3');
      tr.appendChild(total);
      console.log('appended 4');
      if(orderStatus.textContent == 'Completed'){
        tr.classList.add('table-success');
      }
      else{
        tr.classList.add('table-danger');
      }
      tbody.appendChild(tr);
      
    });
    table.appendChild(tbody);
    d1.appendChild(table);
    cardsContainer.appendChild(table);
    document
      .getElementById("homenav")
      .addEventListener("click", redirectToHome, false);
    function redirectToHome() {
      window.location.href =
        "/index.html?value=" + encodeURIComponent(valuePassed);
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
