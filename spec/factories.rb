FactoryGirl.define do
  factory :contact do
    sequence(:email) { |n| "contact#{n}@example.com" }
    sequence(:name) { |n| "Contact #{n}" }
    notes "Lorum Ipsum"
    phone "919-555-1212"

    trait :invalid do
      name nil
    end
  end
end
