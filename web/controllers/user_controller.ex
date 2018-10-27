defmodule Design.UserController do
  use Design.Web, :controller
  alias Design.{User, Auth}
  import Logger


  plug Guardian.Plug.EnsureAuthenticated, [handler: Design.SessionController] when not action in [:current_user]

  # plug :authenticate_user when action in [:index, :show]

  def index(conn, _params) do
    users = Repo.all(Design.User)
    render conn, "index.html", users: users
  end

  def show(conn, %{"id" => id}) do
    user = Design.User
    render conn, "show.html", user: user
  end

  def new(conn, _params) do
    changeset = User.changeset(%User{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"user" => user_params}) do
    changeset = User.registration_changeset(%User{}, user_params)

    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> Guardian.Plug.sign_in(user, :token)
        |> put_flash(:info, "#{user.name} created!")
        |> redirect(to: user_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end


  def current_user(conn, _params) do
    case Auth.decode_and_verify_token(conn) do
      {:ok, _claims} ->
        user = Guardian.Plug.current_resource(conn)

        conn
        |> put_status(:ok)
        |> render(:show, user: user)

      {:error, _reason} ->
        # TODO This never is reached... not sure why.
        :error

    end
  end

end
