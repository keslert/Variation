defmodule Design.User do
  use Design.Web, :model

  schema "users" do
    field :name, :string
    field :username, :string
    field :password, :string, virtual: true
    field :crypted_password, :string

    timestamps
  end

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, ~w(name username), [])
    |> validate_format(:username, ~r/@/)
    |> validate_length(:username, min: 1, max: 20)
    |> unique_constraint(:username)
  end

  def registration_changeset(model, params) do
    model
    |> changeset(params)
    |> cast(params, ~w(password), [])
    |> validate_length(:password, min: 6, max: 100)
    |> generate_encrypted_password()
  end

  defp generate_encrypted_password(changeset_) do
    case changeset_ do
      %Ecto.Changeset{valid?: true, changes: %{password: password_}} ->
        put_change(changeset_, :crypted_password, Comeonin.Bcrypt.hashpwsalt(password_))

      _ ->
        changeset_
    end
  end

end
