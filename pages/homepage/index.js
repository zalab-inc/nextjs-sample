import Head from 'next/head';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch'
import slugify from 'slugify';
import dump from 'var_dump';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { gql, NetworkStatus } from 'apollo-boost';
import { Switch, Case, Unless, Default } from 'react-if';


const GET_POSTS_QUERY = gql`
query ALL_POSTS($first:Int, $skip:Int) {
  allPosts(first: $first, skip: $skip) {
    id
    title
    url
    votes
  }
}
`;
const GET_POSTS_QUERY_VAR = {
  skip: 0,
  first: 1
};

const GET_POSTS_QUERY_LOCAL = gql`
query ALL_POSTS($first:Int, $skip:Int) {
  allPosts(first: $first, skip: $skip) @client {
    id
    title
    url
    votes
  }
}
`;


function Home() {
  const { loading, error, data, networkStatus, fetchMore, client, updateQuery } = useQuery(GET_POSTS_QUERY, {
    variables: GET_POSTS_QUERY_VAR,
    notifyOnNetworkStatusChange: true,
  });

  const posts = data ? data.allPosts : null;
  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore
  
  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: posts.length
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult
        }
        return Object.assign({}, previousResult, {
          allPosts: [...previousResult.allPosts, ...fetchMoreResult.allPosts]
        })
      },
    })
  }
  const refreshData = () => {
    fetchMore({
      variables: {
        skip: 0,
        first: 1
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return Object.assign({}, previousResult, {
          allPosts: fetchMoreResult.allPosts
        })

      }
    })
  }

  const restore = () => {
    client.reFetchObservableQueries({
      query: GET_POSTS_QUERY,
      variables: GET_POSTS_QUERY_VAR,
    });
  }

  const postRender = (post, index) => {
    const slug = slugify(post.title);
    return (
      <div key={index} className="flex flex-column bb mb3">
        <Link href={`/post/[pid]/[single]`} as={`/post/${post.id}/${slug}`}>
          <div className="f6 b dim pointer">{post.title}</div>
        </Link>
        <div className="f6">{post.url}</div>
        <div className="f6">{post.id}</div>
        <button className="btn btn-danger" onClick={() => deletePost(post.id)}>
          Delete
        </button>
      </div>
    )
  }
  const deletePost = (id) => {
    client.writeQuery({
      query: GET_POSTS_QUERY,
      variables: GET_POSTS_QUERY_VAR,
      data: {
        allPosts: [...posts.filter(post => post.id !== id)]
      }
    });

  }
  return (
    <div>
      <Head>
        <title>Homepage</title>
      </Head>
      <div className="container mt5">
        <div className="row">
          <div className="col-sm-6 offset-md-3">
            <div className="ba bw3 b--dark-blue pa3">
              <button className="btn btn-primary mb2" onClick={() => loadMorePosts()}>
                {loading ? 'Loading' : 'Load More'}
              </button>
              <button className="btn btn-primary mb2 ml2" onClick={() => refreshData()}>
                Refresh
              </button>
              <button className="btn btn-primary mb2 ml2" onClick={() => restore()}>
                restore
              </button>
              {posts && posts.map(postRender)}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
      `}
      </style>
    </div>
  )
}


export default Home