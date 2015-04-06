require "rails_helper"

describe "GET /api/v1/contacts" do
  it "returns a list of all contacts in the database" do
    first_contact = create(:contact)
    _second_contact = create(:contact)

    api_get "/api/contacts"

    expect(json_body.count).to eq(2)
    first_contact_json = json_body[0]
    expect(first_contact_json["name"]).to eq(first_contact.name)
  end
end
