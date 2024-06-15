
import { SocketProvider } from "@/components/liveview/SocketProvider";
import { ViewerPage } from "@/components/liveview/ViewerPage";
import { authOptions } from "@/lib/auth";
import { AppFeatures } from "@/lib/config/feature";
import { IsFeatureEnabled } from "@/lib/feature";
import { generateOTP } from "@/lib/otp";
import { getServerSession } from "next-auth";

export default async function Viewer() {
    let session = await getServerSession(authOptions);
    let IsLiveviewEnabled = IsFeatureEnabled(AppFeatures.Liveview, session?.user);

    if (!IsLiveviewEnabled) {
        return <p className="text-red-500">Liveview ist deaktiviert</p>;
    }


    let otp = generateOTP();

    return (
        <SocketProvider socketUrl={process.env.WEBSOCKET_SERVER_URL ?? "http://localhost:3001"}>
            <ViewerPage otp={otp} />
        </SocketProvider>

    );
}