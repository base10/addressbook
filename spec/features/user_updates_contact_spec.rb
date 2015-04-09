require "rails_helper"

feature "User updates contact" do
  scenario "successfully", js: true do
    create(:contact, name: "Ralph P. Bot")

    visit root_path
    click_on "Ralph P. Bot"
    fill_in "Full Name", with: "Ralph"

    click_button "Save Changes"

    expect(page).to have_message("Updated Ralph")
    expect(page).to have_contact("Ralph")
    expect(page).not_to have_contact("Ralph P. Bot")
  end
end
