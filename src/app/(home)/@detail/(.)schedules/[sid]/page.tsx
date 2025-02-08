import ScheduleDetail from "@/components/schedule/detail";

export default async function Page({ params }: { params: Promise<{ sid: string }> }) {
  const { sid } = await params;
  return <ScheduleDetail scheduleId={Number(sid)} />;
}
