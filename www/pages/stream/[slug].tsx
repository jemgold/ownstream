import { NextPage, GetStaticProps } from "next";

const StreamInfo = ({ stream_key, status }) => (
  <div>
    <p>stream key: {stream_key}</p>
    <p>status: {status}</p>
  </div>
)


const Stream: NextPage = () => {
  return <h1>yo</h1>
}

export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const data = false;

  return {
    props: {
      preview
    }
  }
}

export default Stream;