export async function generateToken(channelName: string, uid: string, role: string) {
    const response = await fetch('/api/video-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelName, uid, userRole: role }),
    });
    return response.ok ? (await response.json()).token : null;
  }


  export const checkConferenceAuth = async()=>{
    await fetch(`/api/add-session`);
  }
  