require "rails_helper"

describe Contact do
  it { should validate_presence_of(:email) }
  it "validates uniqueness of email" do
    create(:contact)
    should validate_uniqueness_of(:email)
  end
  it { should validate_presence_of(:name) }
end
