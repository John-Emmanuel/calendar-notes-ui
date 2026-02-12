import api from "../../api/axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface TopNavProps {
  user: User;
  toggleTheme: () => void;
  handleLogout: () => void;
}



export default function TopNav({ user, toggleTheme, handleLogout }: TopNavProps) {
 return (
      <><header className="h-16 flex justify-between items-center px-6 bg-white dark:bg-gray-800 border-b">
        <h1 className="text-3xl font-bold">Calendar Notes App</h1>
        <div className="space-x-2">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            🌙
          </button>
          <span className="inline-block px-3 py-2 text-sm">{user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      </>
 )
};