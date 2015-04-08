module JsonApiHelpers
  def api_get(path)
    get path, {}, v1_headers
  end

  def api_post(path, data)
    post path, data.to_json, v1_headers
  end

  def api_patch(path:, data:)
    patch path, data.to_json, v1_headers
  end

  def json_body
    JSON.parse(response.body)
  end
end

RSpec.configure do |config|
  config.include JsonApiHelpers, type: :request
end
