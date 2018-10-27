defmodule Design.UserView do
  use Design.Web, :view
  alias Design.User
  import Logger

  @attributes ~W(id name username)a

  def first_name(%User{name: name}) do
    name
    |> String.split(" ")
    |> Enum.at(0)
  end


  def render("show.json", %{user: user}) do
    user
    |> Map.take(@attributes)
  end

end
