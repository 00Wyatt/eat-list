import { NavLink } from "react-router";
import { LuCalendarDays, LuHouse, LuUtensils } from "react-icons/lu";

const navigationItems = [
  { label: "Home", to: "/", icon: LuHouse, end: true },
  { label: "Weekly Meals", to: "/weekly-meals", icon: LuCalendarDays },
  { label: "Add / Edit", to: "/meals", icon: LuUtensils },
];

export const BottomNavigation = () => {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky bottom-0 z-100 border-t border-gray-300 bg-white">
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {navigationItems.map(({ label, to, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium duration-100 ${
                  isActive
                    ? "text-sky-600"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon aria-hidden="true" className="size-5" />
                  <span>{label}</span>
                  {isActive && <span className="sr-only">(current page)</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
