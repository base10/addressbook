module Features
  def have_button(text)
    have_css("button", text: text)
  end

  def have_contact(name)
    have_css("[data-role='contact']", text: name)
  end

  def have_message(message)
    have_css("[data-role='feedback']", text: message)
  end
end
