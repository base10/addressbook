(function($){
  var accepts = "application/vnd.addressbook_service+json; version=1";
  var async = true;
  var contentType = "application/json";
  var url = "http://localhost:5100/api/contacts";
  var storedContacts = {};

  var erredContacts = function(_xhr, status, error) {
    console.log("retrieveContacts was unsuccessful");
    console.log("Status: " + status);
    console.log("Error:" + error);
  };

  var processContacts = function(contacts, status, xhr) {
    storedContacts = contacts;

    for (var i = 0; i < storedContacts.length; i++) {
      $(".contacts").append(
        "<li><a data-role='contact' data-value='" + i + "' href='#'>" +
        storedContacts[i].name + "</a></li>"
      );
    }
  };

  var clickContacts = function() {
    $("a[data-role='contact']").click( function() {
      $(this).showContactInForm($(this).data("value"));
    });
  };

  $.fn.retrieveContacts = function() {
    $.ajax({
      async: async,
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

  $.fn.showContactInForm = function(position) {
    var contact = storedContacts[position];

    $("[data-role='contact-header']").html("Contact " + contact.id);
    $("[data-role='email']").val(contact.email);
    $("[data-role='phone']").val(contact.phone);
    $("[data-role='name']").val(contact.name);
    $("[data-role='notes']").val(contact.notes);
  };
})(jQuery);
