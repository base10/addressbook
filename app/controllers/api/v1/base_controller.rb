class Api::V1::BaseController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_filter :verify_csrf_token
end
