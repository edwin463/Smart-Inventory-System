import Inventory from "./layouts/inventory";
import Expenses from "./layouts/expenses";
import Sales from "./layouts/sales";
import Reports from "./layouts/reports";
import ProductDetail from "./layouts/productDetail";
import ProfitReport from "./layouts/ProfitReport";
import SalesOverview from "./layouts/SalesOverview";
import Home from "./components/Home";
import Login from "./layouts/Login";
import Register from "./layouts/Register";


const routes = [
  {
    type: "collapse",
    name: "Inventory",
    key: "inventory",
    icon: <i className="material-icons">inventory</i>,
    route: "/inventory",
    component: <Inventory />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Expenses",
    key: "expenses",
    icon: <i className="material-icons">money</i>,
    route: "/expenses",
    component: <Expenses />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Sales",
    key: "sales",
    icon: <i className="material-icons">store</i>,
    route: "/sales",
    component: <Sales />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    icon: <i className="material-icons">bar_chart</i>,
    route: "/reports",
    component: <Reports />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Profit Report",
    key: "profit-report",
    icon: <i className="material-icons">insights</i>,
    route: "/profit-report",
    component: <ProfitReport />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Sales Overview",
    key: "sales-overview",
    icon: <i className="material-icons">trending_up</i>,
    route: "/sales-overview",
    component: <SalesOverview />,
    protected: true,
  }, 

  {
    type: "route",
    name: "Product Detail",
    key: "product-detail",
    route: "/products/:id",
    component: <ProductDetail />,
    protected: true,
  },
  {
    type: "route",
    name: "Home",
    key: "home",
    route: "/",
    component: <Home />,
    protected: false,
  },
  {
    type: "route",
    name: "Login",
    key: "login",
    route: "/login",
    component: <Login />,
    protected: false,
  },
  {
    type: "route",
    name: "Register",
    key: "register",
    route: "/register",
    component: <Register />,
    protected: false,
  },
];

export default routes;
