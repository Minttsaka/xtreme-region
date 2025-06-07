import { RtcRole, RtcTokenBuilder } from 'agora-access-token';

const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
const appCertificate = process.env.AGORA_APP_CERTIFICATE!;

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { 
      token,
      channelName = "mint", 
      uid=0, 
      userRole = "student", 
      expirationTimeInSeconds = 3600
    } = await req.json();

    // Agora credentials



    if (!appId || !appCertificate) {
      return Response.json({ error: "Agora credentials are missing." }, { status: 500 });
    }

    // Map user role to Agora role
    const role = userRole === "teacher" || userRole === "activeStudent" 
      ? RtcRole.PUBLISHER 
      : RtcRole.SUBSCRIBER;

      const currentTimestamp = Math.floor(Date.now() / 1000)
      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    // Regenerate the token with the same parameters
    const regeneratedToken = RtcTokenBuilder.buildTokenWithUid(
      appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs

    );

    console.log("Is the token valid?", regeneratedToken === token);
    console.log('compare: ',regeneratedToken,'exist',token)
    

    return Response.json({ token, channelName, uid, role: role });
  } catch (error) {
    console.error("Error generating token:", error);
    return Response.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
