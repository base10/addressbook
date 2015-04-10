Rails.application.routes.draw do
  ActiveAdmin.routes(self)

  namespace :api do
    api_version(
      module: "V1",
      header: {
        name: "Accept",
        value: "application/vnd.addressbook_service+json; version=1"
      },
      defaults: { format: :json }
    ) do
      resources :contacts, only: [:index, :create, :update, :destroy]
    end
  end
end
