class Api::V1::ContactsController < Api::V1::BaseController
  def index
    render json: Contact.all
  end

  def create
    contact = Contact.new(contact_params)

    if contact.save
      render json: contact, status: 201
    else
      render json: { errors: contact.errors.full_messages }, status: 422
    end
  end

  def update
    contact = Contact.find(params[:id])

    if contact.update_attributes(contact_params)
      render json: contact, status: 200
    else
      render json: { errors: contact.errors.full_messages }, status: 422
    end
  end

  def destroy
    contact = Contact.find_by(id: params[:id])

    if contact
      contact.destroy
      render nothing: true, status: 204
    else
      render json: { error: "Not found" }, status: 404
    end
  end

  private

  def contact_params
    params.require(:contact).permit(permitted_params)
  end

  def permitted_params
    %i{
      name
      email
      phone
      notes
    }
  end
end
