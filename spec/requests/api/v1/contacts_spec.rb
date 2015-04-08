require "rails_helper"

describe "GET /api/v1/contacts" do
  it "returns a list of all contacts in the database" do
    first_contact = create(:contact)
    _second_contact = create(:contact)

    api_get api_contacts_path

    expect(json_body.count).to eq(2)
    first_contact_json = json_body[0]
    expect(first_contact_json["name"]).to eq(first_contact.name)
  end
end

describe "POST /api/v1/contacts" do
  it "creates the contact in the database" do
    contact_attributes = attributes_for(:contact)
    api_post api_contacts_path, contact: contact_attributes

    expect(response.status).to eq(201)
    expect(Contact.last.name).to eq(contact_attributes[:name])
  end

  context "when there are invalid attributes" do
    it "returns a 422, with errors" do
      contact_attributes = attributes_for(:contact, :invalid)

      api_post api_contacts_path, contact: contact_attributes

      expect(response.status).to eq(422)
      expect(json_body.fetch("errors")).not_to be_empty
    end
  end
end

describe "PUT /api/v1/contacts/1" do
  it "updates the contact in the database" do
    contact = create(
      :contact,
      name: "Nathan",
      email: "nathan@example.com"
    )
    contact_attributes = contact.attributes
    contact_attributes["name"] = "Joe"
    contact_attributes["email"] = "joe@example.com"

    api_patch(
      path: api_contact_path(id: contact.id),
      data: contact_attributes.except("id", "created_at", "updated_at")
    )
    updated_contact = Contact.find(contact.id)

    expect(response.status).to eq(200)
    expect(updated_contact.name).to eq(contact_attributes["name"])
    expect(updated_contact.email).to eq(contact_attributes["email"])
  end
end
