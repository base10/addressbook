require "rails_helper"

feature "User creates contact" do
  scenario "successfully", js: true do
    visit root_path

    find("button", text: "Add a Contact").trigger("click");

    fill_in "Full Name", with: "Ralph P. Bot"
    fill_in "Email Address", with: "ralph@example.com"
    fill_in "Phone Number", with: "919-555-1212"
    fill_in "Notes", with: "Bot Bot Bot"

    click_button "Save Changes"

    expect(page).to have_message("Created Ralph P. Bot")
    expect(page).to have_contact("Ralph P. Bot")
  end
end
