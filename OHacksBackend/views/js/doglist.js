var qs = document.querySelector.bind(document);
document.addEventListener("DOMContentLoaded", function() {
  var dogListEl = qs("#doglist");
  dogListEl.innerHTML = "";

  getDogList(function(dogList) {
    dogList.forEach(function(dog) {
      getDogHTML(dog._id, function(code) {
        dogListEl.innerHTML += code;
      });
    });
  });


});

var getDogList = function(cb) {
  var reqListener = function() {
    cb(JSON.parse(this.responseText));
  };

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "/getDogList");
  oReq.send();
};

var getDogHTML = function(id, cb) {
   
  var reqListener = function() {
    cb(this.responseText);
  };

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "/dogInfo?dogId="+encodeURIComponent(id));
  oReq.send();
};
