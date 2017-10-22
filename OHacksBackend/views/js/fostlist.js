/* Utility */
var qs = document.querySelector.bind(document);
var clearEl = function(el) {
  while (el.firstChild) {
      el.removeChild(el.firstChild);
  }
};


document.addEventListener("DOMContentLoaded", function() {
  var fostlist = qs("#fostererlist");
  fostlist.innerHTML = "";
  updateFostererList();
});

var updateFostererList = function() {
  var fostlist = qs("#fostererlist");

  var table = document.createElement("table");

  getFostererList(function(fosterers) {
    clearEl(fostlist);
    fosterers.forEach(function(f) {
      var row = document.createElement("tr");
      var c1 = document.createElement("td");
      c1.innerText = f.Foster.main.email;

      var capp = document.createElement("td");
      if (f.Foster.main.is_approved) {
        capp.innerText = "Approved";
      } else {
        var approveLink = createApproveLink(f);
        capp.appendChild(approveLink);
      }
      row.appendChild(c1);
      row.appendChild(capp);

      table.appendChild(row);
    });

    fostlist.appendChild(table);
  });


};

var createApproveLink = function(f) {
  var link = document.createElement("a");
  link.innerText = "Not approved";
  link.style.color = "blue";

  link.addEventListener("click", function() {
    var reqListener = function() {
      updateFostererList(); 
    };

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("POST", "/confirmUser");
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(JSON.stringify({ fosterId: f._id }));

  });

  return link;
};

var getFostererList = function(cb) {
  var reqListener = function() {
    cb(JSON.parse(this.responseText));
  };

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "/getFosterList");
  oReq.send();
};
