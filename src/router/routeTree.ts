import { rootRoute } from "@/routes/__root";
import routes from "@/routes/routes";

const routeTree = rootRoute.addChildren(routes);

export default routeTree;
