class AddSortIndexToAssignments < ActiveRecord::Migration[8.1]
  def change
    add_column :assignments, :sort_index, :integer, default: 0
  end
end
