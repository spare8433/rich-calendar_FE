import ScheduleDetail from "@/app/components/schedule/detail";

export default async function Page({ params }: { params: Promise<{ sid: string }> }) {
  const { sid } = await params;
  return <ScheduleDetail scheduleId={Number(sid)} />;
}
