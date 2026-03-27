import { auth } from "@/auth";
import { getNotifications, markNotificationsAsRead } from "@/app/actions";
import { redirect } from "next/navigation";
import NotificationsClient from "@/components/NotificationsClient";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notifications = await getNotifications();
  
  // Mark as read when viewing the page
  await markNotificationsAsRead();

  return (
    <div className="max-w-2xl mx-auto w-full py-8 px-4">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Signals & Mentions</h1>
        <p className="text-zinc-600 text-sm font-medium uppercase tracking-widest">Digital protocol updates</p>
      </div>
      
      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
