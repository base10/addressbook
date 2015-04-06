module JsonApiHelpers
  def api_get(path)
    get path, {}, v1_headers
  end

  def json_body
    JSON.parse(response.body)
  end
end

RSpec.configure do |config|
  config.include JsonApiHelpers, type: :request
end
