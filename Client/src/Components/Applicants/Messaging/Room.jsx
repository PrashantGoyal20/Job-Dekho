import { useEffect } from 'react';
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  useTracks,
  ControlBar,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

export default function VideoGrid() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);

  useEffect(() => {
    console.log('Tracks:', tracks);
  }, [tracks]);

  return (
    <div>
      <GridLayout tracks={tracks}>
        {tracks.map((trackRef) => (
          <ParticipantTile
            key={`${trackRef.participant.identity}-${trackRef.source}`}
            trackRef={trackRef}
            showParticipantName
          />
        ))}
      </GridLayout>
    </div>

  );
}

