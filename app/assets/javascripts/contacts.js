var accepts = "application/vnd.addressbook_service+json; version=1";
var async = true;
var contentType = "application/json";
var url = "/api/contacts";
var storedContacts = {};

var hideFeedback = function() {
  $(".error").hide();
  $("[data-role='feedback']").hide();
  $("[data-role='feedback']").remove("p");
  $("[data-role='feedback']").removeClass("flash-success flash-error");
};

var showFeedback = function(type, message) {
  var flashClass = {
    error: "flash-error",
    success: "flash-success"
  }
 
  $("[data-role='feedback']").addClass(flashClass[type]);
  $("[data-role='feedback']").html("<p>" + message + "</p>");
  $("[data-role='feedback']").show();
};

var showError = function(method) {
  hideFeedback();
  showFeedback(
    "error",
    "Error: " + method + " was unsuccessful."
  );
};

var showSuccess = function(contact, method) {
  hideFeedback();
  var methodMsg = {
    "PUT": "Updated",
    "POST": "Created"
  };

  showFeedback(
    "success",
    methodMsg[method] + " " + contact.name
  );
};

var erredContacts = function(_xhr, status, error) {
  hideFeedback();
  console.log("retrieveContacts was unsuccessful");
  console.log("Status: " + status);
  console.log("Error:" + error);
  showError("Retrieving contacts");
};

var erredUpdate = function(xhr, status, error) {
  hideFeedback();
  console.log("updateContacts was unsuccessful");
  console.log("Status: " + status);
  console.log("Error:" + JSON.stringify(error));
  console.log("XHR:" + JSON.stringify(xhr));
  showError("Adding or updating the contact");
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
  hideFeedback();

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

var propertyIsValid = function(contact, property) {
  if (!contact[property]) {
    $("[data-role='" + property +  "-error']").show();
    console.log(property + " is invalid");
    return false;
  }
  else {
    return true;
  }
};

var validateContact = function(contact) {
  return propertyIsValid(contact, "email") && propertyIsValid(contact, "name");
};

var isNewRecord = function(id) {
  if (id > 0) {
    return false;
  }
  else {
    return true;
  }
};

var setUpdateMethod = function(id) {
  if (isNewRecord(id)) {
    return "POST";
  }
  else {
    return "PUT";
  }
};

var setUpdateUrl = function(id) {
  if (isNewRecord(id)) {
    return url;
  }
  else {
    return url + "/" + id;
  }
};

var updateContact = function() {
  hideFeedback();

  var contact = {
    email: $("[data-role='email']").val(),
    name: $("[data-role='name']").val(),
    phone: $("[data-role='phone']").val(),
    notes: $("[data-role='notes']").val()
  };

  if (validateContact(contact)) {
    var id = $("[data-role='id']").val();

    event.preventDefault();
    $.ajax({
      async: async,
      data: JSON.stringify(contact),
      error: erredUpdate,
      headers: {
        "Accept": accepts,
        "Content-Type": contentType,
      },
      method: setUpdateMethod(id),
      success: [
        showSuccess(contact, setUpdateMethod(id)),
        retrieveContacts
      ],
      url: setUpdateUrl(id)
    });
  }
};
