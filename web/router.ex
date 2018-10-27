defmodule Design.Router do
  use Design.Web, :router

  pipeline :browser do
    plug :accepts, ["html", "json"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :browserAuth do
    plug Guardian.Plug.VerifySession # looks in the session for the token
    plug Guardian.Plug.LoadResource
    # plug Design.Auth, repo: Design.Repo
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :apiAuth do
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/", Design do
    pipe_through [:browser, :browserAuth]

    get "/users/register", UserController, :new
    get "/users/login", SessionController, :new
    get "/users/logout", SessionController, :delete

    resources "/users", UserController, only: [:index, :show, :create]

    resources "/sessions", SessionController, only: [:new, :create, :delete]

    get "/", PageController, :index

    scope "/app" do
      get "*path", PageController, :app
    end
  end

  scope "/api/v1", Design do
    pipe_through :api

    resources "/creators", CreatorController, only: [:index, :show]
  end

  scope "/api/v1", Design do
    pipe_through [:api, :apiAuth]

    get "/current_user", UserController, :current_user
    resources "/readers", ReaderController, only: [:index, :create, :delete]
    resources "/reading-entries", ReadingEntryController, only: [:index, :create, :delete] do
      resources "/books", ReadingEntryBookController, only: [:index, :create, :delete]
    end

  end

  # Other scopes may use custom stacks.
  # scope "/api", Design do
  #   pipe_through :api
  # end
end
