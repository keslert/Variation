# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Design.Repo.insert!(%SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

import Ecto.Changeset

alias Design.{Repo, User}

[%{username: "admin@example.com", password: "tester", name: "Admin"},]
|> Enum.map(&User.registration_changeset(%User{}, &1))
|> Enum.each(&Repo.insert!(&1))
