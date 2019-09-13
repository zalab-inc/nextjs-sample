import Head from 'next/head';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import dump from 'var_dump';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Switch, Case, Default } from 'react-if';


const GET_POSTS_QUERY = gql`
query post($id: ID) {
  Post(id:$id) {
    id
    title
    url
    votes
  }
}
`;

const Post = () => {
  const router = useRouter()
  const { pid } = router.query

  const { loading, error, data } = useQuery(GET_POSTS_QUERY, {
    variables: {
      id: pid
    }
  });
  const post = data ? data.Post : {};
  return (
    <div className="container mt5">
      <Head>
        <title>Post single</title>
      </Head>
      <div className="row">
        <div className="col-sm-6 offset-3">
          <div className="ba bw2 b--blue pa3">
            <Switch>
              <Case condition={loading}>
                <h1>Loading</h1>
              </Case>
              <Case condition={!!data}>
                <div className="f6">{post.id}</div>
                <div className="f4 b dim pointer">{post.title}</div>
                <div className="f6">{post.url}</div>
              </Case>
            </Switch>
            <Link href="/">
              <div className="btn btn-primary pointer mt3">
                Back
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Post.getInitialProps = async ({ query }) => {
//   const { pid } = await query && query;
//   const result = await fetch(`https://jsonplaceholder.typicode.com/posts/${pid}`);
//   const post = await result.json();
//   return {
//     post,
//   }
// }

export default Post