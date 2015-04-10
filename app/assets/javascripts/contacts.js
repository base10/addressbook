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
    notice: "flash-notice",
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
    "POST": "Created",
    "DELETE": "Deleted"
  };

  showFeedback(
    "success",
    methodMsg[method] + " " + contact.name
  );
};

var recordAndDisplayError = function(xhr, status, error, message) {
  hideFeedback();
  console.log(message + " was unsuccessful");
  console.log("Status: " + status);
  console.log("Error:" + JSON.stringify(error));
  console.log("XHR:" + JSON.stringify(xhr));
  showError(message);
};

var erredContacts = function(xhr, status, error) {
  recordAndDisplayError(xhr, status, error, "Retrieving contacts");
};

var erredContactDelete = function(xhr, status, error) {
  recordAndDisplayError(xhr, status, error, "Deleting the contact");
};

var erredUpdate = function(xhr, status, error) {
  recordAndDisplayError(xhr, status, error, "Adding or updating the contact");
};


var anyContacts = function() {
  if (storedContacts.length > 0) {
    return true;
  }
  else {
    return false;
  }
};

var showContactList = function() {
  $(storedContacts).each(function(index) {
    $(".contacts").append(
      "<li><a data-role='contact' data-value='" + index + "' href='#'>" +
      storedContacts[index].name + "</a></li>"
    );
  });
};

var showEmptyContactList = function() {
  $(".contacts").append(
    "<li data-role='contact'>No contacts yet</li>"
  );
};

var displayContacts = function() {
  if (anyContacts()) {
    showContactList();
  }
  else {
    showEmptyContactList();
  }
};

var setStoredContacts = function(contacts) {
  storedContacts = contacts;
};

var processContacts = function(contacts) {
  setStoredContacts(contacts);
  $("[data-role='contact']").remove();
  displayContacts();
};

var showContactView = function() {
  hideFeedback();
  $("[data-role='contact-form']").hide();
  $("[data-role='contact-view']").show();
};

var showContactForm = function() {
  hideFeedback();
  $("[data-role='contact-view']").hide();
  $("[data-role='contact-form']").show();
};

var determineContactUrl = function(id) {
  if (isNewRecord(id)) {
    return url;
  }
  else {
    return url + "/" + id;
  }
};

var deleteContactAjaxAction = function(contact) {
  var method = "DELETE";

  $.ajax({
    async: async,
    contentType: contentType,
    dataType: "json",
    error: erredContactDelete,
    headers: {
      "Accept": accepts,
      "Content-Type": contentType,
    },
    method: method,
    success: [
      retrieveContacts,
      showSuccess(contact, method)
    ],
    url: determineContactUrl(contact.id),
  });
};

var deleteContact = function(position) {
  var contact = storedContacts[position];
  var confirmation = confirm("Verify you want to delete " + contact.name);

  if (confirmation) {
    deleteContactAjaxAction(contact);
  }
  else {
    showFeedback(
      "notice",
      "Delete cancelled"
    );
  }
};

var showContactInForm = function(position) {
  showContactForm();

  var contact = storedContacts[position];

  $("[data-role='contact-header']").html("Contact " + contact.id);
  $("[data-role='id']").val(contact.id);
  $("[data-role='email']").val(contact.email);
  $("[data-role='phone']").val(contact.phone);
  $("[data-role='name']").val(contact.name);
  $("[data-role='notes']").val(contact.notes);
};

var resetButtons = function(position) {
  $("#edit-contact").unbind("click");
  $("#delete-contact").unbind("click");

  $("#edit-contact").click( function() {
    showContactInForm(position);
  });

  $("#delete-contact").click( function() {
    deleteContact(position);
  });
};

var showContact = function(position) {
  showContactView();
  var contact = storedContacts[position];

  $("[data-role='view-email']").html(contact.email);
  $("[data-role='view-phone']").html(contact.phone);
  $("[data-role='view-name']").html(contact.name);
  $("[data-role='view-notes']").html(contact.notes);

  resetButtons(position);
};

var clickContacts = function() {
  $("a[data-role='contact']").click( function() {
    showContact($(this).data("value"));
  });
};

var clearContactForm = function() {
  $("[data-role='contact-header']").html("Contact");
  $("[data-role='id']").val("");
  $("[data-role='contact-form']").trigger("reset");
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
      url: determineContactUrl(id)
    });
  }
};
