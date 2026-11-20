import { MyServicesTable } from "@/components/WebComponents/Technician/MyServices/MyServicesTable";
import { DEMO_SERVICES } from "@/library/demoServices";

export default function MyServicesPreviewPage() {
  return <MyServicesTable services={DEMO_SERVICES} />;
}
