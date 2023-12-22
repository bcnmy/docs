import React from 'react';
import TOCItems from '@theme-original/TOCItems';
import Feedback from '../../components/Feedback';

export default function TOCItemsWrapper(props) {
  return (
    <>
      <TOCItems {...props} />
      <div className="table-of-contents">
      <Feedback />
      </div>

    </>
  );
}
