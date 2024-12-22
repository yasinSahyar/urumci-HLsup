(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function c(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(t){if(t.ep)return;t.ep=!0;const n=c(t);fetch(t.href,n)}})();function g(){const e=document.getElementById("step-1"),r=document.getElementById("step-2"),c=document.getElementById("next-step"),o=document.getElementById("payment-form");if(c.addEventListener("click",()=>{var u,l,p,i,m,f;const t=(u=document.getElementById("card-name"))==null?void 0:u.value.trim(),n=(l=document.getElementById("address"))==null?void 0:l.value.trim(),a=(p=document.getElementById("city"))==null?void 0:p.value.trim(),s=(i=document.getElementById("state"))==null?void 0:i.value.trim(),y=(m=document.getElementById("phone"))==null?void 0:m.value.trim(),d=(f=document.getElementById("email"))==null?void 0:f.value.trim();if(!t||!n||!a||!s||!y||!d){alert("Please fill in all required fields.");return}localStorage.setItem("billingDetails",JSON.stringify({cardName:t,address:n,city:a,state:s,phone:y,email:d})),e.classList.remove("active"),r.classList.add("active")}),!o){console.error("Payment form not found.");return}o.addEventListener("submit",t=>{var d,u;t.preventDefault();const n=JSON.parse(localStorage.getItem("billingDetails")||"{}"),a=(d=document.getElementById("card-number"))==null?void 0:d.value.trim(),s=(u=document.getElementById("card-expiration"))==null?void 0:u.value.trim();if(!a||!s){alert("Please complete all payment details.");return}if(Math.random()>.2){alert("Payment successful!");const l=JSON.parse(localStorage.getItem("cart")||"[]"),p=l.reduce((i,m)=>i+m.quantity*m.price,0);h({...n,cardNumber:a,cardExpiration:s},l,p),E({...n,cardNumber:a,cardExpiration:s},l,p),localStorage.removeItem("billingDetails"),localStorage.removeItem("cart"),setTimeout(()=>{window.location.href="index.html"},5e3)}else alert("Payment failed. Please try again.")})}function E(e,r,c){fetch("/api/purchase",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customerDetails:{cardName:e.cardName,address:e.address,city:e.city,state:e.state,phone:e.phone,email:e.email},paymentDetails:{cardNumber:e.cardNumber,cardExpiration:e.cardExpiration},cart:r,total:c})}).then(o=>{if(!o.ok)throw new Error("Failed to send purchase details");return o.json()}).then(o=>{console.log("Purchase successfully sent to backend:",o)}).catch(o=>{console.error("Error sending purchase details to backend:",o)})}function h(e,r,c){const o=document.getElementById("receipt-container"),t=document.getElementById("customer-name"),n=document.getElementById("payment-date"),a=document.getElementById("customer-address"),s=document.getElementById("customer-phone"),y=document.getElementById("customer-email"),d=document.getElementById("product-list"),u=document.getElementById("total-amount"),l=document.getElementById("print-receipt-btn");t.textContent=`Cardholder: ${e.cardName}`,a.textContent=`Address: ${e.address}, ${e.city}, ${e.state}`,s.textContent=`Phone: ${e.phone}`,y.textContent=`Email: ${e.email}`;const p=new Date().toLocaleString();n.textContent=`Date: ${p}`,d.innerHTML="",r.forEach(i=>{const m=document.createElement("li");m.textContent=`${i.name} - ${i.quantity} pcs - €${i.price.toFixed(2)}`,d.appendChild(m)}),u.textContent=`Total: €${c.toFixed(2)}`,o.style.display="block",l.onclick=()=>window.print()}document.addEventListener("DOMContentLoaded",()=>g());function I(){fetch("/api/purchase").then(e=>{if(!e.ok)throw new Error("Failed to fetch payments");return e.json()}).then(e=>{const r=document.getElementById("payment-table-body");r.innerHTML="",e.forEach(c=>{const o=document.createElement("tr");o.innerHTML=`
          <td>${c.cardName}</td>
          <td>${c.email}</td>
          <td>€${c.total.toFixed(2)}</td>
          <td>${new Date(c.createdAt).toLocaleString()}</td>
        `,r.appendChild(o)})}).catch(e=>{console.error("Error loading payments:",e)})}document.addEventListener("DOMContentLoaded",()=>{window.location.pathname.includes("addProduct.html")&&I()});export{I as l,g as p};