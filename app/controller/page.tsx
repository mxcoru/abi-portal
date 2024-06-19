import { ControllerPage } from "@/components/liveview/controller/ControllerPage";
import { SocketProvider } from "@/components/liveview/shared/SocketProvider";
import { authOptions } from "@/lib/auth";
import { AppFeatures } from "@/lib/config/feature";
import { IsFeatureEnabled } from "@/lib/feature";
import { getServerSession } from "next-auth";

export default async function ControlPanel() {
    let session = await getServerSession(authOptions);
    let IsLiveviewEnabled = await IsFeatureEnabled(AppFeatures.LiveviewController, session?.user);
    let IsLiveviewControllerEnabled = IsFeatureEnabled(AppFeatures.LiveviewController, session?.user);

    if (!IsLiveviewEnabled) {
        return <p className="text-red-500">Liveview ist deaktiviert</p>;
    }

    if (!IsLiveviewControllerEnabled) {
        return <p className="text-red-500">Liveview Controller ist deaktiviert</p>;
    }


    if (!session?.user) {
        return (
            <div className="w-svw h-svh flex flex-row">
                <div className="w-full h-svh flex flex-col justify-center items-center">
                    <h1 className="mt-2 text-xl font-semibold">Bitte einloggen</h1>
                </div>
            </div>
        )
    }

    return (
        <SocketProvider socketUrl={process.env.WEBSOCKET_SERVER_URL ?? "http://localhost:3001"} >
            <ControllerPage username={session.user.name} />
        </SocketProvider>
    );
}