import { useEffect, useState, useRef, useMemo } from "react"
import "./App.css"
import { type User } from "./types.ts"
import { UsersList } from "./components/UsersList.jsx"

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    setSortByCountry((prevState) => !prevState)
  }

  const handleDetele = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  useEffect(() => {
    fetch("https://randomuser.me/api?results=100")
      .then(async (res) => await res.json())
      .then((res) => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const filteredUsers = useMemo(() => {
    return filterCountry != null && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLocaleLowerCase())
        })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    return sortByCountry
      ? filteredUsers.toSorted((a, b) => {
          return a.location.country.localeCompare(b.location.country)
        })
      : filteredUsers
  }, [filteredUsers, sortByCountry])

  return (
    <div className="App">
      <h1>Playing with React Hooks</h1>
      <header>
        <button onClick={toggleColors}>Pint rows</button>
        <button onClick={toggleSortByCountry}>
          {" "}
          {sortByCountry ? "No ordenar por país" : "Ordenar por país"}
        </button>
        <button onClick={handleReset}>Reset Users</button>
        <input
          placeholder="Filter by country..."
          onChange={(e) => setFilterCountry(e.target.value)}
        />
      </header>
      <main>
        <UsersList
          deleteUser={handleDetele}
          showColors={showColors}
          users={sortedUsers}
        />
      </main>
    </div>
  )
}

export default App
