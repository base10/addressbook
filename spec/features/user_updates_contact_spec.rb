require "rails_helper"

feature "User updates contact" do
  scenario "successfully", js: true do
    create(:contact, name: "Ralph P. Bot")
    visit root_path

    click_on "Ralph P. Bot"
    click_button "Edit"

    fill_in "Full Name", with: "Ralph"
    click_button "Save Changes"

    expect(page).to have_message("Updated Ralph")
    expect(page).to have_contact("Ralph")
    expect(page).not_to have_contact("Ralph P. Bot")

    expect(page).to have_button("Edit")
    expect(page).to have_button("Delete")
    expect(page).not_to have_button("Save Changes")
  end
end
