defmodule Design.PageController do
  use Design.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def app(conn, _params) do
    conn
    |> put_layout("react.html")
    |> render("app.html")
  end
end
