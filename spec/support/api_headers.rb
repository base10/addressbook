module RequestHeaders
  def v1_headers
    {
      "Content-Type" => "application/json",
      "Accept" => "application/vnd.addressbook_service+json; version=1",
    }
  end
end

RSpec.configure do |config|
  config.include RequestHeaders, type: :request
end
