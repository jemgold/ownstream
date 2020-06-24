import client, { previewClient } from './sanity';

const getClient = (preview: Boolean) => (preview ? previewClient : client);

const streamFields = `
  name
`;

export const getStream = async (slug: string, preview: Boolean) => {
  const results = await getClient(preview).fetch(
    /* groq */ `*[type == 'stream' && slug.current == $slug] {
    ${streamFields}
  }`,
    { slug },
  );

  return results?.[0];
};
