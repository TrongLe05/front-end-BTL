import MapCard from "@/components/ui/CardMap/cardmap";
export default function GioiThieu() {
  return (
    <>
      <div className="text-center my-6">
        <h1 className="text-3xl font-bold">Giới thiệu</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <MapCard />
      </div>
    </>
  );
}
