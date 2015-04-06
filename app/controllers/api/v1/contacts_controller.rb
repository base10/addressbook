class Api::V1::ContactsController < Api::V1::BaseController
  def index
    render json: Contact.all
  end
end
