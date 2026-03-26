import MapCard from "@/components/ui/Card/CardMap/cardmap";
export default function GioiThieu() {
  return (
    <>
      <div className="text-center my-6">
        <h1 className="text-3xl font-bold">Giới thiệu</h1>
      </div>
      <div className="grid gap-6 place-items-center md:grid-cols-1">
        <MapCard />
      </div>
    </>
  );
}
