import { Metadata } from "next";
import Services from "./Services";

export const metadata: Metadata = {
  title: "Manage Services . FixMate Admin",
};

const AdminServicesPage = () => {
  return <Services />;
};

export default AdminServicesPage;
