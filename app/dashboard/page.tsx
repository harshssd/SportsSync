'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InstagramMedia, InstagramProfile } from '@/lib/instagram';
import Image from 'next/image';

const fetchInstagramStatus = async () => {
  const res = await fetch('/api/instagram/status');
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
};

const fetchInstagramProfile = async () => {
  const res = await fetch('/api/instagram/me');
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json() as Promise<InstagramProfile>;
};

const fetchInstagramMedia = async () => {
  const res = await fetch('/api/instagram/media');
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json() as Promise<{ data: InstagramMedia[] }>;
};

const disconnectInstagram = async () => {
  const res = await fetch('/api/instagram/connection', { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to disconnect');
  return res.json();
};

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const { data: status, isLoading: isStatusLoading, error: statusError } = useQuery({
    queryKey: ['instagramStatus'],
    queryFn: fetchInstagramStatus,
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['instagramProfile'],
    queryFn: fetchInstagramProfile,
    enabled: !!status?.connected,
  });

  const { data: media, isLoading: isMediaLoading } = useQuery({
    queryKey: ['instagramMedia'],
    queryFn: fetchInstagramMedia,
    enabled: !!status?.connected,
  });
  
  const disconnectMutation = useMutation({
    mutationFn: disconnectInstagram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramStatus'] });
      queryClient.removeQueries({ queryKey: ['instagramProfile'] });
      queryClient.removeQueries({ queryKey: ['instagramMedia'] });
    },
  });

  const handleConnect = () => {
    window.location.href = '/api/instagram/login';
  };

  const renderConnectionStatus = () => {
    if (isStatusLoading) return <div>Loading connection status...</div>;
    if (statusError) return <div className="text-red-500">Error: {statusError.message}</div>;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Instagram Connection</CardTitle>
          <CardDescription>
            {status?.connected ? `Connected as ${profile?.username || '...'}` : 'Connect your Instagram account to see your profile and media.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status?.connected ? (
             <Button variant="destructive" onClick={() => disconnectMutation.mutate()} disabled={disconnectMutation.isPending}>
              {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect Account'}
            </Button>
          ) : (
            <Button onClick={handleConnect}>Connect Instagram</Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderProfile = () => {
    if (!status?.connected) return null;
    if (isProfileLoading) return <div>Loading profile...</div>;
    if (!profile) return <div className="text-red-500">Could not load Instagram profile. It might not be a business or creator account.</div>;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          {profile.profile_picture_url && (
            <Image
              src={profile.profile_picture_url}
              alt={profile.username}
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{profile.username}</h3>
            <p className="text-sm text-muted-foreground">{profile.followers_count?.toLocaleString() || 0} Followers</p>
             <p className="text-xs text-muted-foreground uppercase">{profile.account_type}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderMedia = () => {
    if (!status?.connected) return null;
    if (isMediaLoading) return <div>Loading media...</div>
    if (!media || media.data.length === 0) return <p>No media found.</p>

    return (
      <Card>
         <CardHeader>
          <CardTitle>Recent Media</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.data.map(item => (
                <div key={item.id} className="relative aspect-square">
                  {item.media_type === 'VIDEO' ? (
                     <video
                      src={item.media_url}
                      poster={item.thumbnail_url}
                      controls={false}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <Image
                      src={item.media_url || 'https://via.placeholder.com/300'}
                      alt={item.caption || 'Instagram media'}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {renderConnectionStatus()}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
            {renderProfile()}
        </div>
        <div className="lg:col-span-2">
            {renderMedia()}
        </div>
      </div>
    </div>
  );
}
