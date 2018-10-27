defmodule Design.Auth do
  import Plug.Conn
  import Comeonin.Bcrypt, only: [checkpw: 2]
  alias Design.{Repo, User}

  def authenticate(%{"username" => username, "password" => password}) do
    user = Repo.get_by(User, username: String.downcase(username))
    cond do
      user && checkpw(password, user.crypted_password) ->
        {:ok, user}
      user ->
        {:error, :unauthorized}
      true ->
        {:error, :not_found}
    end
  end

  def decode_and_verify_token(conn) do
    conn
    |> Guardian.Plug.current_token
    |> Guardian.decode_and_verify
  end

end
