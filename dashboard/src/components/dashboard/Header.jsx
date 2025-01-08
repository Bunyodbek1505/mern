/* eslint-disable react/prop-types */
function Header({ onMenuClick }) {
    return (
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
  
          <div className="flex items-center space-x-4">
            <button className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
  
            <button className="flex items-center space-x-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User"
                className="h-8 w-8 rounded-full"
              />
              <span>John Doe</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  export default Header