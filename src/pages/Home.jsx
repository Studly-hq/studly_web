import React from 'react';
import Feed from '../components/feed/Feed';
import FeedComposer from '../components/feed/FeedComposer';

const Home = () => {
  return (
    <div>
      <FeedComposer />
      <Feed />
    </div>
  );
};

export default Home;
