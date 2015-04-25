function Contact() {
  this.accepts = "application/vnd.addressbook_service+json; version=1";
  this.async = true;
  this.contentType = "application/json";
  this.url = "/api/contacts";
  this.storedContacts = {};

  this.hideFeedback = function() {
    $(".error").hide();
    $("[data-role='feedback']").hide();
    $("[data-role='feedback']").remove("p");
    $("[data-role='feedback']").removeClass("flash-success flash-error");
  };

  this.showFeedback = function(type, message) {
    this.flashClass = {
      error: "flash-error",
      notice: "flash-notice",
      success: "flash-success"
    }
 
    $("[data-role='feedback']").addClass(flashClass[type]);
    $("[data-role='feedback']").html("<p>" + message + "</p>");
    $("[data-role='feedback']").show();
  };

  this.showError = function(method) {
    this.hideFeedback();
    this.showFeedback(
      "error",
      "Error: " + method + " was unsuccessful."
    );
  };

  this.showSuccess = function(contact, method) {
    this.hideFeedback();
    var methodMsg = {
      "PUT": "Updated",
      "POST": "Created",
      "DELETE": "Deleted"
    };

    this.showFeedback(
      "success",
      methodMsg[method] + " " + contact.name
    );
  };

  this.recordAndDisplayError = function(xhr, status, error, message) {
    this.hideFeedback();
    console.log(message + " was unsuccessful");
    console.log("Status: " + status);
    console.log("Error:" + JSON.stringify(error));
    console.log("XHR:" + JSON.stringify(xhr));
    this.showError(message);
  };

  this.erredContacts = function(xhr, status, error) {
    this.recordAndDisplayError(xhr, status, error, "Retrieving contacts");
  };

  this.erredContactDelete = function(xhr, status, error) {
    this.recordAndDisplayError(xhr, status, error, "Deleting the contact");
  };

  this.erredUpdate = function(xhr, status, error) {
    this.recordAndDisplayError(
      xhr,
      status,
      error,
      "Adding or updating the contact"
    );
  };

  this.anyContacts = function() {
    return this.storedContacts.length > 0;
  };

  this.showContactList = function() {
    $(this.storedContacts).each(function(index) {
      $(".contacts").append(
        "<li><a data-role='contact' data-value='" + index + "' href='#'>" +
        this.storedContacts[index].name + "</a></li>"
      );
    });
  };

  this.showEmptyContactList = function() {
    $(".contacts").append(
      "<li data-role='contact'>No contacts yet</li>"
    );
  };

  this.fooContacts = function() {
    alert("hellp");

    if (this.anyContacts()) {
      this.showContactList();
    }
    else {
      this.showEmptyContactList();
    }
  };

  this.processContacts = function(contacts) {
    this.storedContacts = contacts;
    $("[data-role='contact']").remove();
    this.fooContacts();
    alert("goodbye");
  };

  this.showContactView = function() {
    this.hideFeedback();
    $("[data-role='contact-form']").hide();
    $("[data-role='contact-view']").show();
  };

  this.showContactForm = function() {
    this.hideFeedback();
    $("[data-role='contact-view']").hide();
    $("[data-role='contact-form']").show();
  };

  this.determineContactUrl = function(id) {
    if (this.isNewRecord(id)) {
      return url;
    }
    else {
      return url + "/" + id;
    }
  };

  this.deleteContactAjaxAction = function(contact) {
    this.method = "DELETE";

    $.ajax({
      async: this.async,
      contentType: this.contentType,
      dataType: "json",
      error: this.erredContactDelete,
      headers: {
        "Accept": this.accepts,
        "Content-Type": this.contentType,
      },
      method: method,
      success: [
        this.retrieveContacts,
        this.showSuccess(contact, method)
      ],
      url: this.determineContactUrl(contact.id),
    });
  };

  this.deleteContact = function(position) {
    this.contact = storedContacts[position];
    this.confirmation = confirm("Verify you want to delete " + contact.name);

    if (confirmation) {
      this.deleteContactAjaxAction(contact);
    }
    else {
      this.showFeedback(
        "notice",
        "Delete cancelled"
      );
    }
  };

  this.showContactInForm = function(position) {
    this.showContactForm();

    this.contact = storedContacts[position];

    $("[data-role='contact-header']").html("Contact " + contact.id);
    $("[data-role='id']").val(contact.id);
    $("[data-role='email']").val(contact.email);
    $("[data-role='phone']").val(contact.phone);
    $("[data-role='name']").val(contact.name);
    $("[data-role='notes']").val(contact.notes);
  };

  this.resetButtons = function(position) {
    $("#edit-contact").unbind("click");
    $("#delete-contact").unbind("click");

    $("#edit-contact").click( function() {
      this.showContactInForm(position);
    });

    $("#delete-contact").click( function() {
      this.deleteContact(position);
    });
  };

  this.showContact = function(position) {
    this.showContactView();
    var contact = this.storedContacts[position];

    $("[data-role='view-email']").html(contact.email);
    $("[data-role='view-phone']").html(contact.phone);
    $("[data-role='view-name']").html(contact.name);
    $("[data-role='view-notes']").html(contact.notes);

    this.resetButtons(position);
  };

  this.clickContacts = function() {
    $("a[data-role='contact']").click( function() {
      this.showContact($(this).data("value"));
    });
  };

  this.clearContactForm = function() {
    $("[data-role='contact-header']").html("Contact");
    $("[data-role='id']").val("");
    $("[data-role='contact-form']").trigger("reset");
  };

  this.retrieveContacts = function() {
    $.ajax({
      async: this.async,
      contentType: this.contentType,
      dataType: "json",
      error: this.erredContacts,
      headers: {
        "Accept": this.accepts,
        "Content-Type": this.contentType,
      },
      method: "GET",
      success: [
        this.processContacts,
        this.clickContacts
      ],
      url: this.url,
    });
  };

  this.propertyIsValid = function(contact, property) {
    if (!contact[property]) {
      $("[data-role='" + property +  "-error']").show();
      console.log(property + " is invalid");
      return false;
    }
    else {
      return true;
    }
  };

  this.validateContact = function(contact) {
    return propertyIsValid(contact, "email") && propertyIsValid(contact, "name");
  };

  this.isNewRecord = function(id) {
    if (id > 0) {
      return false;
    }
    else {
      return true;
    }
  };

  this.setUpdateMethod = function(id) {
    if (isNewRecord(id)) {
      return "POST";
    }
    else {
      return "PUT";
    }
  };

  this.updateContact = function() {
    this.hideFeedback();

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
        async: this.async,
        data: JSON.stringify(contact),
        error: this.erredUpdate,
        headers: {
          "Accept": this.accepts,
          "Content-Type": this.contentType,
        },
        method: this.setUpdateMethod(id),
        success: [
          this.showSuccess(contact, this.setUpdateMethod(id)),
          this.retrieveContacts
        ],
        url: this.determineContactUrl(id)
      });
    }
  };
};
