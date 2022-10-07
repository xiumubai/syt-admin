import { Outlet } from "react-router-dom";
import withAuthorization from "@/components/withAuthorization";

function EmptyLayout() {
	return <Outlet />;
}

export default withAuthorization(EmptyLayout);
