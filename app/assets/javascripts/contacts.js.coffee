root = exports ? this

class root.ContactHandler
  constructor: ->

  accepts: "application/vnd.addressbook_service+json; version=1"
  async: true
  contentType: "application/json"
  url: "/api/contacts"
  storedContacts: ""
  flashClass:
    error: "flash-error"
    notice: "flash-notice"
    success: "flash-success"

  hideFeedback: ->
    $(".error").hide()
    $("[data-role='feedback']").hide()
    $("[data-role='feedback']").remove("p")
    $("[data-role='feedback']").removeClass("flash-success flash-error")

  showFeedback: (type, message) ->
    $("[data-role='feedback']").addClass(flashClass[type])
    $("[data-role='feedback']").html("<p>" + message + "</p>")
    $("[data-role='feedback']").show()

  showError: (method) ->
    this.hideFeedback
    this.showFeedback("error", "Error: " + method + " was unsuccessful.")

  showSuccess = (contact, method) ->
    this.hideFeedback

    methodMsg =
      "PUT": "Updated"
      "POST": "Created"
      "DELETE": "Deleted"

    showFeedback("success", methodMsg[method] + " " + contact.name)

  recordAndDisplayError: (message) ->
    console.log(message + " was unsuccessful")
#     console.log("Status: " + status)
#     console.log("Error:" + JSON.stringify(error))
#     console.log("XHR:" + JSON.stringify(xhr))
    this.showError(message)

  erredContacts: (xhr, status, error) ->
    this.recordAndDisplayError "Retrieving contacts"

  erredContactDelete: (xhr, status, error) ->
    this.recordAndDisplayError(xhr, status, error, "Deleting the contact")

  erredUpdate: (xhr, status, error) ->
    this.recordAndDisplayError(xhr, status, error, "Adding or updating the contact")

  anyContacts: ->
    this.storedContacts.length > 0

  showContactInList: (contact) ->
    $(".contacts").append(
      "<li><a data-role='contact' data-value='" + contact.id + "' href='#'>" +
      contact.name + "</a></li>"
    )

  showContactList: ->
    console.log "showContactList"
    this.showContactInList contact for contact in this.storedContacts

  showEmptyContactList: ->
    $(".contacts").append(
      "<li data-role='contact'>No contacts yet</li>"
    )

  showAppropriateContactList: ->
    console.log "showAppropriateContactList"

    if this.anyContacts
      this.showContactList
    else
      this.showEmptyContactList

  processContacts: (contacts) ->
    promise = new Promise()
    console.log "processContacts 1"

    this.storedContacts = contacts

    console.log "processContacts 2"
    $("[data-role='contact']").remove()

    console.log "processContacts 3"
    promise.complete(this.showAppropriateContactList)

  showContactView: ->
    this.hideFeedback
    $("[data-role='contact-form']").hide
    $("[data-role='contact-view']").show

  showContactForm: ->
    hideFeedback
    $("[data-role='contact-view']").hide
    $("[data-role='contact-form']").show

  isNewRecord: (id) ->
    if id > 0
      false
    else
      true

  determineContactUrl: (id) ->
    if isNewRecord(id)
      this.url
    else
      this.url + "/" + id

  deleteContactAjaxAction: (contact) ->
    method = "DELETE"

    $.ajax
      async: this.async
      contentType: this.contentType
      dataType: "json"
      error: this.erredContactDelete
      headers:
        "Accept": this.accepts
        "Content-Type": this.contentType
      method: this.method
      success: [
        this.retrieveContacts,
        this.showSuccess(contact, method)
      ]
      url: this.determineContactUrl(contact.id)

  deleteContact: (position) ->
    contact = this.storedContacts[position]
    confirmation = confirm "Verify you want to delete " + contact.name

    if confirmation
      this.deleteContactAjaxAction contact
    else
      this.showFeedback "notice", "Delete cancelled"

  showContactInForm: (position) ->
    this.showContactForm
    contact = this.storedContacts[position]

    $("[data-role='contact-header']").html("Contact " + contact.id)
    $("[data-role='id']").val(contact.id)
    $("[data-role='email']").val(contact.email)
    $("[data-role='phone']").val(contact.phone)
    $("[data-role='name']").val(contact.name)
    $("[data-role='notes']").val(contact.notes)

  resetButtons: (position) ->
    $("#edit-contact").unbind("click")
    $("#delete-contact").unbind("click")

    $("#edit-contact").click(
      this.showContactInForm position
    )

    $("#delete-contact").click(
      this.deleteContact position
    )

  showContact: (position) ->
    this.showContactView
    contact = storedContacts[position]

    $("[data-role='view-email']").html(contact.email)
    $("[data-role='view-phone']").html(contact.phone)
    $("[data-role='view-name']").html(contact.name)
    $("[data-role='view-notes']").html(contact.notes)

    this.resetButtons position

  clickContacts: ->
    console.log "clickContacts"
    $("a[data-role='contact']").click(
      this.showContact($(this).data("value"))
    )

  clearContactForm: ->
    $("[data-role='contact-header']").html("Contact")
    $("[data-role='id']").val("")
    $("[data-role='contact-form']").trigger("reset")

  retrieveContacts: ->
    $.ajax this.url,
      async: this.async
      contentType: this.contentType
      dataType: "json"
      error: this.erredContacts
      headers:
        "Accept": this.accepts
        "Content-Type": this.contentType
      method: "GET"
      success: Promise.when(this.processContacts).then(this.clickContacts)

  propertyIsValid: (contact, property) ->
    if !contact[property]
      $("[data-role='" + property +  "-error']").show()
      console.log(property + " is invalid")
      false
    else
      true

  validateContact: (contact) ->
    this.propertyIsValid(contact, "email") and this.propertyIsValid(contact, "name")

  setUpdateMethod: (id) ->
    if this.isNewRecord id
      "POST"
    else
      "PUT"

  updateContact: ->
    this.hideFeedback

    contact =
      email: $("[data-role='email']").val()
      name: $("[data-role='name']").val()
      phone: $("[data-role='phone']").val()
      notes: $("[data-role='notes']").val()

    if this.validateContact contact
      id = $("[data-role='id']").val()

      event.preventDefault

      $.ajax
        async: this.async
        data: JSON.stringify(contact)
        error: this.erredUpdate
        headers:
          "Accept": this.accepts
          "Content-Type": this.contentType
        method: this.setUpdateMethod id
        success: [
          this.showSuccess contact, this.setUpdateMethod id
          this.retrieveContacts
        ]
        url: this.determineContactUrl id
