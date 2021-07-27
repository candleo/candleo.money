const navbar = document.getElementById("navbar");
const walletcontectID = document.getElementById("walletconnect");
let scrolled = false;

// window.onscroll = function () {
//   if (window.pageYOffset > 120) {
//     navbar.classList.remove("top");
//     walletcontectID.classList.remove("top");
//     if (!scrolled) {
//       navbar.style.transform = "translateY(-195px)";
//       walletcontectID.style.transform = "translateY(-195px)";
//     }
//     setTimeout(function () {
//       navbar.style.transform = "translateY(0)";
//       walletcontectID.style.transform = "translateY(0)";
//       scrolled = true;
//     }, 300);
//   } else {
//     navbar.classList.add("top");
//     walletcontectID.classList.add("top");
//     scrolled = false;
//   }
// };

// // Smooth Scrolling
// $("#navbar a, .btn").on("click", function (e) {
//   if (this.hash !== "") {
//     e.preventDefault();

//     const hash = this.hash;

//     $("html, body").animate(
//       {
//         scrollTop: $(hash).offset().top - 85,
//       },
//       200
//     );
//   }
// });

$("#connectwallet").click(() => {
  var themeElementbyHash = window.location.hash;
  if (themeElementbyHash == "#pricepredict") {
    initpriceContract(); // topFunction();
  } else if (themeElementbyHash == "#stake") {
    initContract();
    // topFunction();
  } else {
    initContract();
    // topFunction();
  }
});

//  <i class="fa fa-circle text-danger"></i>Connect Wallet
function navswitch() {
  var x = document.getElementById("nav");
  var x2 = document.getElementById("nav-img");
  var x3 = document.getElementById("social");
  // var navClass = document.getElementsByClassName("navbar");
  var hrg = document.getElementById("hrgrad");

  if (x.style.display === "block") {
    x.style.display = "none";
    x2.style.display = "none";
    hrg.style.display = "none";
    x3.style.display = "none";
    // navClass.style.flexDirection = "row";
  } else {
    x.style.display = "block";
    x2.style.display = "flex";
    hrg.style.display = "block";
    x3.style.display = "flex";
    // navClass.style.flexDirection = "column";
  }
}

function accountswitch() {
  var x = document.getElementById("walletconnect");
  var y = document.getElementById("walletswitch");
  if (x.style.display === "flex") {
    x.style.display = "none";
    y.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
  } else {
    x.style.display = "flex";
    y.innerHTML = '<i class="far fa-window-close"></i> ';
  }
}
