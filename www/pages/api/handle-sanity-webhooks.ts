import { NextApiHandler } from 'next';
import Cors from 'micro-cors';
import Mux from '@mux/mux-node';
import sanityClient, { Transaction, SanityDocument } from '@sanity/client';

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const handleSanityWebhooks: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const transaction = JSON.parse(req.body);

      const {
        projectId,
        dataset,
        ids: { created: createdIds, updated: updatedIds, deleted: deletedIds },
      } = transaction;

      const client = sanityClient({
        projectId,
        dataset,
        token: process.env.SANITY_WRITE_TOKEN,
      });

      if (createdIds.length > 0) {
        const { Video } = new Mux(
          process.env.MUX_TOKEN_ID,
          process.env.MUX_TOKEN_SECRET,
        );

        const docs = await client.getDocuments(createdIds);

        const streamDocs = docs.filter((doc) => doc && doc._type === 'stream');
        console.log(streamDocs);

        const transaction = client.transaction();

        streamDocs.forEach(async (stream) => {
          const liveStream = await Video.LiveStreams.create({
            playback_policy: 'public',
            reconnect_window: 30,
            new_asset_settings: {
              playback_policy: 'public',
            },
            test: false,
          });

          const {
            id,
            status,
            active_asset_id: activeAssetId,
            recent_asset_ids: recentAssetIds,
            playback_ids: playbackIds,
            stream_key: streamKey,
          } = liveStream;

          const muxStream = {
            id,
            status,
            activeAssetId,
            recentAssetIds,
            playbackId: playbackIds[0].id,
            streamKey,
          };

          return transaction.patch(stream._id, (p) =>
            p.set({
              muxStream,
            }),
          );
        });

        const newDocs = await transaction.commit();
      }

      if (deletedIds.length > 0) {
        const { Video } = new Mux(
          process.env.MUX_TOKEN_ID,
          process.env.MUX_TOKEN_SECRET,
        );

        const docs = await client.getDocuments(deletedIds);

        const eventDocs = docs.filter((doc) => doc && doc._type === 'event');
        const deletionPromises = eventDocs.map((doc) => {
          if (!!doc.muxStream && !!doc.muxStream.id) {
            return Video.LiveStreams.del(doc.muxStream.id);
          }
        });

        const res = await Promise.all(deletionPromises);
      }
      return res.json('ok');
    } catch (err) {}
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default cors(handleSanityWebhooks);
