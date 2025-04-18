import { homePageView } from "../view/home_page.js";
import { calendarPageView } from "../view/calendar_page.js";
import { signinPageView } from "../view/signin_page.js";

export const routePathnames = {
  HOME: '/',
  CALENDAR: '/calendar',
  SIGNIN: '/signin',
};

export const routes = [
  { path: routePathnames.HOME, page: homePageView },
  { path: routePathnames.CALENDAR, page: calendarPageView },
  { path: routePathnames.SIGNIN, page: signinPageView }
];


export function routing(pathname, hash) {
  const route = routes.find(r => r.path == pathname);
  if (route) {
    if (hash && hash.length > 1) {
      route.page(hash.substring(1));
    } else {
      route.page();
    }
  } else {
    // Now this will correctly show the sign-in view
    window.location.hash = "#/signin";
  }
}
