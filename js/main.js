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
