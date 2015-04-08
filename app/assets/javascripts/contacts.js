var accepts = "application/vnd.addressbook_service+json; version=1";
var async = true;
var contentType = "application/json";
var url = "http://localhost:5100/api/contacts";
var storedContacts = {};

var erredContacts = function(_xhr, status, error) {
  // FIXME: Display result to the user
  console.log("retrieveContacts was unsuccessful");
  console.log("Status: " + status);
  console.log("Error:" + error);
};

var erredUpdate = function(_xhr, status, error) {
  // FIXME: Display result to the user
  console.log("updateContacts was unsuccessful");
  console.log("Status: " + status);
  console.log("Error:" + error);
};

var processContacts = function(contacts, status, xhr) {
  storedContacts = contacts;
  $("[data-role='contact']").remove();

  $(storedContacts).each(function(index) {
    $(".contacts").append(
      "<li><a data-role='contact' data-value='" + index + "' href='#'>" +
      storedContacts[index].name + "</a></li>"
    );
  });
};

var showContactInForm = function(position) {
  var contact = storedContacts[position];

  $("[data-role='contact-header']").html("Contact " + contact.id);
  $("[data-role='id']").val(contact.id);
  $("[data-role='email']").val(contact.email);
  $("[data-role='phone']").val(contact.phone);
  $("[data-role='name']").val(contact.name);
  $("[data-role='notes']").val(contact.notes);
};

var clickContacts = function() {
  $("a[data-role='contact']").click( function() {
    showContactInForm($(this).data("value"));
  });
};

var showSuccess = function() {
  // FIXME: Display result to the user
  console.log("Form submission worked!");
};

var clearContactForm = function() {
  $("[data-role='contact-header']").html("Contact");
  $("[data-role='id']").val("");
  $("#contact_form").trigger("reset");
};

var retrieveContacts = function() {
  $.ajax({
    async: async,
    contentType: contentType,
    dataType: "json",
    error: erredContacts,
    headers: {
      "Accept": accepts,
      "Content-Type": contentType,
    },
    method: "GET",
    success: [
      processContacts,
      clickContacts
    ],
    url: url,
  });
};

var updateContact = function() {
  var contact = {
    email: $("[data-role='email']").val(),
    name: $("[data-role='name']").val(),
    phone: $("[data-role='phone']").val(),
    notes: $("[data-role='notes']").val()
  };

  var id = $("[data-role='id']").val();
  var method = "POST";
  var updateUrl = url;

  if (id > 0) {
    method = "PATCH";
    updateUrl = updateUrl + "/" + id;
  }

  $.ajax({
    async: async,
    data: JSON.stringify(contact),
    error: erredUpdate,
    headers: {
      "Accept": accepts,
      "Content-Type": contentType,
    },
    method: method,
    success: [
      showSuccess,
      retrieveContacts,
    ],
    url: updateUrl
  });
};
