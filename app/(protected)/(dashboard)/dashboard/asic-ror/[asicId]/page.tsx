import { AsicRorDetails } from "@/components/asic-ror/asic-ror-details";

type AsicRorDetailsPageProps = {
  params: {
    asicId: string;
  };
};

export default function AsicRorDetailsPage({ params }: AsicRorDetailsPageProps) {
  return <AsicRorDetails asicId={params.asicId} />;
}
