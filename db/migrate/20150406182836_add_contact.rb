class AddContact < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.string :name, null: false
      t.string :email, null: false, unique: true
      t.string :phone
      t.text :notes

      t.timestamps null: false
    end
  end
end
