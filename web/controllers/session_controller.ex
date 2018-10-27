defmodule Design.SessionController do
  use Design.Web, :controller

  def new(conn, _params) do
    render conn, "new.html"
  end

  def create(conn, %{"session" => session_params}) do

    case Design.Auth.authenticate(session_params) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "Welcome back!")
        |> Guardian.Plug.sign_in(user, :token)
        |> redirect(to: page_path(conn, :index))
      {:error, _reason} ->
        conn
        |> put_flash(:error, "Invalid username/password combination")
        |> redirect(to: session_path(conn, :new))
    end
  end

  def delete(conn, _) do
    # {:ok, claims} = Guardian.Plug.claims(conn)

    conn
    |> Guardian.Plug.sign_out
    # |> Guardian.Plug.current_token
    # |> Guardian.revoke!(claims)
    |> redirect(to: session_path(conn, :new))


  end

  def unauthenticated(conn, _params) do
    # ToDo: We should be deleting the token. Look into Guardian.db
    conn
    |> redirect(to: session_path(conn, :new))
  end

end
