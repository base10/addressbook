ActiveAdmin.register Contact do
  permit_params :name, :email, :phone, :notes
end
