import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation(); // Get the current route

  const links = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/products", label: "Products" },
    { path: "/admin/categories", label: "Categories" },
    { path: "/admin/orders", label: "Orders" },
    { path: "/admin/settings", label: "Settings" },
    { path: "/admin/profile", label: "Profile" },
    { path: "/logout", label: "Logout" },
  ];

  return (
    <nav className="admin-sidebar bg-blue-600 text-white h-full w-64 p-4">
      <ul>
        {links.map((link) => (
          <li key={link.path} className="mb-2">
            <Link
              to={link.path}
              className={`block px-4 py-2 rounded ${
                location.pathname === link.path ? "bg-blue-700" : "hover:bg-blue-500"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
