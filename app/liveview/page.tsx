
import { SocketProvider } from "@/components/liveview/shared/SocketProvider";
import { ViewerPage } from "@/components/liveview/viewer/ViewerPage";
import { authOptions } from "@/lib/auth";
import { AppFeatures } from "@/lib/config/feature";
import { IsFeatureEnabled } from "@/lib/feature";
import { generateOTP } from "@/lib/otp";
import { getServerSession } from "next-auth";

export default async function Viewer() {
    let session = await getServerSession(authOptions);
    let IsLiveviewEnabled = await IsFeatureEnabled(AppFeatures.Liveview, session?.user);

    if (!IsLiveviewEnabled) {
        return <p className="text-red-500">Liveview ist deaktiviert</p>;
    }


    let otp = generateOTP();

    return (
        <SocketProvider socketUrl={process.env.WEBSOCKET_SERVER_URL ?? "http://localhost:3001"}>
            <ViewerPage otp={otp} fileServerUrl={process.env.FILE_SERVER_URL ?? ""} />
        </SocketProvider>

    );
}